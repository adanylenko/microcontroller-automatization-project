package a.danylenko.microcontroller.automatization.project.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.config.annotation.configurers
    .ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration
    .AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration
    .EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers
    .AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers
    .AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

//@Configuration
//@EnableAuthorizationServer
public class OAuth2Config extends AuthorizationServerConfigurerAdapter {

  private final UserDetailsService userDetailsService;

  private final TokenStore tokenStore;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Value("${auth.access.token.expire.period:3600}")
  private int accessTokenExpirePeriod;

  @Value("${auth.refresh.token.expire.period:3600}")
  private int refreshTokenExpirePeriod;

  @Value("${auth.client.id:testId}")
  private String clientId;

  @Value("${auth.client.secret:testSecret}")
  private String clientSecret;

  @Value("${auth.token.signing.key:testSigningKey}")
  private String tokenSigningKey;

  public OAuth2Config(final UserDetailsService userDetailsService, final TokenStore tokenStore) {
    this.userDetailsService = userDetailsService;
    this.tokenStore = tokenStore;
  }

  @Override
  public void configure(final AuthorizationServerEndpointsConfigurer configurer) throws Exception {
    configurer.authenticationManager(authenticationManager);
    configurer.userDetailsService(userDetailsService);
    configurer.accessTokenConverter(accessTokenConverter());
    configurer.tokenStore(tokenStore);
    configurer.reuseRefreshTokens(false);
  }

  @Override
  public void configure(final ClientDetailsServiceConfigurer clients) throws Exception {
    // @formatter:off
    clients.inMemory().withClient(clientId).secret(clientSecret)
        .accessTokenValiditySeconds(accessTokenExpirePeriod)
        .refreshTokenValiditySeconds(refreshTokenExpirePeriod)
        .authorizedGrantTypes("password", "refresh_token").scopes("read", "write");
    // @formatter:on
  }

  @Override
  public void configure(final AuthorizationServerSecurityConfigurer oauthServer) throws Exception {
    oauthServer.checkTokenAccess("permitAll()");
  }


  @Bean
  public JwtAccessTokenConverter accessTokenConverter() {
    final JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
    converter.setSigningKey(tokenSigningKey);
    return converter;
  }
}