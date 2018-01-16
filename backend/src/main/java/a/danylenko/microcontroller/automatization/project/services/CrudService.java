package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;

public interface CrudService<T> {
  T getByIdAndUserId(final String id, final String userId) throws NoSuchItemException;

  List<T> getAllByUserId(final String userId);

  void add(final T item, final String userId)
      throws ItemAlreadyExistsException, NoSuchItemException;

  void delete(final String id, final String userId) throws NoSuchItemException;

  void update(final T item, final String userId) throws NoSuchItemException;
}
