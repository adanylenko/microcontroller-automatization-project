package a.danylenko.microcontroller.automatization.project.services.impl;

import a.danylenko.microcontroller.automatization.project.services.EmailSender;
import org.springframework.core.task.TaskExecutor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class EmailSenderImpl implements EmailSender {

  private final JavaMailSender javaMailSender;
  private final TaskExecutor taskExecutor;

  public EmailSenderImpl(final JavaMailSender javaMailSender, final TaskExecutor taskExecutor) {
    this.javaMailSender = javaMailSender;
    this.taskExecutor = taskExecutor;
  }

  public void sendSimpleMessage(final String from, final String to, final String subject,
      final String text) {
    final SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject(subject);
    message.setText(text);
    message.setFrom(from);

    taskExecutor.execute(new Sender(javaMailSender, message));
  }

  private static class Sender implements Runnable {
    private final JavaMailSender javaMailSender;
    private final SimpleMailMessage simpleMailMessage;

    Sender(final JavaMailSender javaMailSender, final SimpleMailMessage simpleMailMessage) {
      this.javaMailSender = javaMailSender;
      this.simpleMailMessage = simpleMailMessage;
    }

    @Override
    public void run() {
      javaMailSender.send(simpleMailMessage);
    }
  }
}