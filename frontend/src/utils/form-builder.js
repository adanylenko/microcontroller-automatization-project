export function initField(
  that,
  name,
  initialValue,
  validator,
  existingRecord,
  isCheckbox
) {
  const field = {};

  field[name] = {
    onChange: e => {
      const updatedField = { ...that.state[name] };
      updatedField.value = isCheckbox
        ? e.currentTarget.checked
        : e.currentTarget.value;

      const newState = {};
      newState[name] = updatedField;
      that.setState(newState);

      validator(e.currentTarget.value).then(result => {
        const fieldState = that.state[name];
        fieldState.validation = result;
        const updatedState = {};
        updatedState[name] = fieldState;
        that.setState(updatedState);
      });
    },
    validationCurrentValue: () => {
      const updatedField = { ...that.state[name] };

      const newState = {};
      newState[name] = updatedField;
      that.setState(newState);

      validator(updatedField.value).then(result => {
        const fieldState = that.state[name];
        fieldState.validation = result;
        const updatedState = {};
        updatedState[name] = fieldState;
        that.setState(updatedState);
      });
    },
    setValue: value => {
      const updatedField = { ...that.state[name] };
      updatedField.value = value;

      const newState = {};
      newState[name] = updatedField;
      that.setState(newState);

      validator(value).then(result => {
        const fieldState = that.state[name];
        fieldState.validation = result;
        const updatedState = {};
        updatedState[name] = fieldState;
        that.setState(updatedState);
      });
    },
    validation: existingRecord ? { empty: !!initialValue, valid: true } : null,
    validator,
    value: initialValue
  };

  return field;
}

export default initField;
