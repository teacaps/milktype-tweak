import React from 'react';
import {AccentSelect} from './inputs/accent-select';
import {AccentSlider} from './inputs/accent-slider';
import {Detail, IndentedControlRow, Label} from './panes/grid';
import type {VIADefinitionV2, VIADefinitionV3} from '@the-via/reader';
import {useAppSelector} from 'src/store/hooks';
import {
  getDesignSelectedOptionKeys,
  updateSelectedOptionKeys,
} from 'src/store/designSlice';
import {useDispatch} from 'react-redux';

interface Props {
  definition: VIADefinitionV2 | VIADefinitionV3;
  onLayoutChange: (newSelectedOptionKeys: number[]) => void;
  RowComponent?: React.JSXElementConstructor<any>;
}

function Layouts({
  definition,
  onLayoutChange,
  RowComponent = IndentedControlRow,
}: Props): JSX.Element | null {
  const selectedOptionKeys = useAppSelector(getDesignSelectedOptionKeys);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateSelectedOptionKeys([]));
  }, [definition]);

  React.useEffect(() => {
    onLayoutChange(selectedOptionKeys);
  }, [selectedOptionKeys]);

  if (!definition.layouts.labels) {
    return null;
  }

  const LayoutControls = definition.layouts.labels.map((label, layoutKey) => {
    const optionKeys = definition.layouts.optionKeys[layoutKey];

    // Multiple versions of this layout
    if (Array.isArray(label)) {
      const name = label[0];
      const options = label.slice(1);

      const selectElementOptions = options.map((option, optionIndex) => ({
        label: option,
        value: optionKeys[optionIndex],
      }));

      return (
        <RowComponent key={`${layoutKey}-${name}`}>
          <Label>{name.toLowerCase()}</Label>
          <Detail>
            <AccentSelect
              onChange={(option: any) => {
                if (option && option.label) {
                  const optionIndex = options.indexOf(option.label);
                  const optionKeys = Array.from(selectedOptionKeys).map(
                    (i) => i || 0,
                  );
                  optionKeys[layoutKey] = optionIndex;
                  dispatch(updateSelectedOptionKeys(optionKeys));
                }
              }}
              value={
                selectedOptionKeys[layoutKey]
                  ? selectElementOptions[selectedOptionKeys[layoutKey]]
                  : (selectElementOptions[0] as any)
              }
              options={selectElementOptions as any}
            />
          </Detail>
        </RowComponent>
      );
    }
    if (typeof label === 'string') {
      return (
        <RowComponent key={`${layoutKey}-${label}`}>
          <Label>{label.toLowerCase()}</Label>
          <Detail>
            <AccentSlider
              isChecked={Boolean(selectedOptionKeys[layoutKey])}
              onChange={(isChecked) => {
                const optionKeys = Array.from(selectedOptionKeys).map(
                  (i) => i || 0,
                );
                optionKeys[layoutKey] = Number(isChecked);
                dispatch(updateSelectedOptionKeys(optionKeys));
              }}
            />
          </Detail>
        </RowComponent>
      );
    }
    return null;
  });

  return <>{LayoutControls}</>;
}

export default Layouts;
