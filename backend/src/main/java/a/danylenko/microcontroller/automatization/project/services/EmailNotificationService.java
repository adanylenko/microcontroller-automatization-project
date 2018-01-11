package a.danylenko.microcontroller.automatization.project.services;

import a.danylenko.microcontroller.automatization.project.exceptions.CantSendNotificationException;

public interface EmailNotificationService {

  void sendNotification(String email, String name, String password)
      throws CantSendNotificationException;
}
