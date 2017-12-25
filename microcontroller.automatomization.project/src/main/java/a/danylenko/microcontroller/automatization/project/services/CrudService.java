package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;

public interface CrudService<T> {
  T getById(final String id) throws NoSuchItemException;

  List<T> getAll();

  void add(final T item) throws ItemAlreadyExistsException, NoSuchUserException,
      NoSuchItemException;

  void delete(final String id) throws NoSuchItemException;

  void update(final T item) throws NoSuchItemException;
}
