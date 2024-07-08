/* eslint-disable react-refresh/only-export-components */
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./style.css";
export const ACTIONS = {
  CLEAR: "clear",
  CHOOSE_OPERATION: "chosse",
  DELETE_DIGIT: "delete",
  ADD_DIGIT: "add",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.override || (state.cur == "0" && payload.digit != "0"))
        return { ...state, override: false, cur: `${payload.digit}` };
      else if (state.cur == "0" && payload.digit == "0") return state;
      else if (
        state.cur != undefined &&
        state.cur.includes(".") &&
        payload.digit == "."
      )
        return state;
      return {
        ...state,
        cur: `${state.cur || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.prev == undefined && state.cur == undefined) return state;
      else if (state.prev == undefined)
        return {
          ...state,
          prev: `${state.cur || ""}`,
          cur: null,
          operation: `${payload.operation}`,
        };
      else if (state.cur == null)
        return { ...state, operation: payload.operation };
      return {
        ...state,
        prev: evaluate(state),
        cur: null,
        operation: payload.operation,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.override) return { ...state, override: false, cur: undefined };
      else if (state.cur.length == 1) return { ...state, cur: undefined };
      else if (state.cur != undefined)
        return {
          ...state,
          cur: `${state.cur.slice(0, -1)}`,
        };
      return state;
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.cur != undefined &&
        state.prev != undefined &&
        state.operation != undefined
      )
        return {
          ...state,
          cur: evaluate(state),
          override: true,
          prev: null,
          operation: null,
        };
      return state;
  }
}

function evaluate({ cur, prev, operation }) {
  const p = parseFloat(prev);
  const c = parseFloat(cur);
  if (isNaN(p) || isNaN(c)) return "";
  let result = "";
  switch (operation) {
    case "+":
      result = `${p + c}`;
      break;
    case "-":
      result = `${p - c}`;
      break;
    case "*":
      result = `${p * c}`;
      break;
    case "÷":
      result = `${p / c}`;
      break;
  }
  return result;
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == undefined) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == undefined) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const App = () => {
  const [{ cur, prev, operation }, dispatch] = useReducer(reducer, {});
  return (
    <div className="grid-container">
      <div className="output">
        <div className="prev">
          {formatOperand(prev)} {operation}
        </div>
        <div className="curr">{formatOperand(cur)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation={"÷"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};
export default App;
