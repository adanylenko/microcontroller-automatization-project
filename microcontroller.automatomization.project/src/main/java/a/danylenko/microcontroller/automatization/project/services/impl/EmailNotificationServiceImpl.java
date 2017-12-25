package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.Locale;

import a.danylenko.microcontroller.automatization.project.exceptions.CantSendNotificationException;
import a.danylenko.microcontroller.automatization.project.services.EmailNotificationService;
import a.danylenko.microcontroller.automatization.project.services.EmailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;

public class EmailNotificationServiceImpl implements EmailNotificationService {
  private static final Logger LOG = LoggerFactory.getLogger(EmailNotificationServiceImpl.class);

  private final EmailSender emailSender;
  private final MessageSource messageSource;

  @Value("${auth.user.notifications.email.from}")
  private String emailFrom;

  public EmailNotificationServiceImpl(final EmailSender emailSender,
      final MessageSource messageSource) {
    this.emailSender = emailSender;
    this.messageSource = messageSource;
  }

  @Override
  public void sendNotification(final String email, final String name, final String password)
      throws CantSendNotificationException {
    try {

      LOG.debug("Send notification from email={}, to email={}", emailFrom, email);

      final String messageBody = messageSource
          .getMessage("email.notification.message", new Object[] {email, password}, Locale.ENGLISH);
      final String messageSubject =
          messageSource.getMessage("email.notification.subject", null, Locale.ENGLISH);

      emailSender.sendSimpleMessage(emailFrom, email, messageSubject, messageBody);
    } catch (Exception ex) {
      LOG.error("Error when try to send notification to email:", email, ex);
      throw new CantSendNotificationException(ex.getMessage());
    }
  }
}
