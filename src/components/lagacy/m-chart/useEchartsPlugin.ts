import * as echarts from 'echarts/core';
import {
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from 'echarts/components';
import {BarChart, BarSeriesOption, LineChart, LineSeriesOption} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

let initialized = false;

export type ECOption = echarts.ComposeOption<BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption>

export function useEchartsPlugin() {
  if (initialized) return;
  initialized = true;
  echarts.use(
    [
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      LineChart,
      CanvasRenderer,
      BarChart,
    ],
  );
}
