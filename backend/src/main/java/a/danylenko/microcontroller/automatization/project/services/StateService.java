package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.State;

public interface StateService extends CrudService<State> {
  List<State> getStatesByCommandId(final String commandId);
}
