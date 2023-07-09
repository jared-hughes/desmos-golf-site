import { For, Show, children, createEffect } from "solid-js";
import { DesmosData, TestCase } from "../../../shared/challenge";

import MathQuill from "mathquill-commonjs";
import "mathquill-commonjs/mathquill.css";
import {
  FailedTestCaseOutput,
  serializeDesmosData,
} from "../../../shared/execute-challenge";
const MQ = MathQuill.getInterface(2);

export function StaticMath(props: { latex: () => string }) {
  return (
    <div
      ref={(el) => {
        const mq = MQ.StaticMath(el);
        createEffect(() => {
          mq.latex(props.latex());
        });
      }}
    ></div>
  );
}

export function Bitmap(props: { pixels: () => number[]; width: () => number }) {
  return (
    <canvas
      width={props.width()}
      height={props.pixels().length / 4 / props.width()}
      ref={(el) => {
        const ctx = el.getContext("2d");

        createEffect(() => {
          const arr = new Uint8ClampedArray(props.pixels());
          ctx?.putImageData(new ImageData(arr, props.width()), 0, 0);
        });
      }}
    ></canvas>
  );
}

import "./TestCaseDisplay.less";

export function FailedTestCaseDisplay(props: {
  case: () => FailedTestCaseOutput;
}) {
  return (
    <div class="failed-test-case-display">
      <h3>Inputs</h3>
      <For each={props.case().inputs}>
        {(inp) => (
          <StaticMath
            latex={() => inp.name + "=" + serializeDesmosData(inp.value)}
          ></StaticMath>
        )}
      </For>
      <Show when={props.case().screenshot}>
        <h3>Screenshot Outputs</h3>
        <div class="screenshot-container">
          <div class="screenshot">
            <h4>Expected</h4>
            {
              <Bitmap
                pixels={() => props.case().screenshot?.reference as number[]}
                width={() => props.case().screenshot?.width as number}
              ></Bitmap>
            }
          </div>
          <div class="screenshot">
            <h4>Your Graph</h4>
            {
              <Bitmap
                pixels={() => props.case().screenshot?.test as number[]}
                width={() => props.case().screenshot?.width as number}
              ></Bitmap>
            }
          </div>
          <div class="screenshot">
            <h4>Difference ({(props.case().screenshot?.diff ?? 0) * 100}%)</h4>
            {
              <Bitmap
                pixels={() => {
                  const test = props.case().screenshot?.test as number[];
                  const reference = props.case().screenshot
                    ?.reference as number[];

                  const diff = [];

                  for (let i = 0; i < test.length; i++) {
                    diff.push(
                      i % 4 === 3 ? 255 : Math.abs(test[i] - reference[i])
                    );
                  }

                  return diff;
                }}
                width={() => props.case().screenshot?.width as number}
              ></Bitmap>
            }
          </div>
        </div>
      </Show>
      <Show when={props.case().outputs}>
        <h3>Expression Outputs</h3>
        <table>
          <thead>
            <tr>
              <th>Expected</th>
              <th>Your Graph</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.case().outputs}>
              {(out) => (
                <tr>
                  <td>
                    <StaticMath
                      latex={() =>
                        out.name + "=" + serializeDesmosData(out.reference)
                      }
                    ></StaticMath>
                  </td>
                  <td>
                    <StaticMath
                      latex={() =>
                        out.name + "=" + serializeDesmosData(out.test)
                      }
                    ></StaticMath>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </Show>
    </div>
  );
}
