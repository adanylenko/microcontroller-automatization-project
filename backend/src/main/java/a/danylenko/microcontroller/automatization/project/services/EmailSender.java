package a.danylenko.microcontroller.automatization.project.services;

public interface EmailSender {

  void sendSimpleMessage(String from, String to, String subject, String text);
}
