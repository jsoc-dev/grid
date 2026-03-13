# TODO

1. Remove the JsocGrid component, move the design to hook based implementation.

2. Consumer will use the hook to get the column definitions and rows, and will render the grid UI component on its own.

3. The multiple instances support (for persisting states of each subgrid) will need to be implemented in the consumer end. Though, we can provide a helper hook for the same. Default behavior will be one grid instance at a time.
