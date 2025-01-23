import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {Button} from '../../inputs/button';
import {KeycodeModal} from '../../inputs/custom-keycode-modal';
import {title, component} from '../../icons/keyboard';
import {component as LoadIcon} from '../../icons/milktype/load';
import {component as DownloadIcon} from '../../icons/milktype/download';
import * as EncoderPane from './encoder';
import {
  keycodeInMaster,
  getByteForCode,
  getKeycodes,
  getOtherMenu,
  IKeycode,
  IKeycodeMenu,
  categoriesForKeycodeModule,
  getCodeForByte,
} from '../../../utils/key';
import {ErrorMessage, SuccessMessage} from '../../styled';
import {
  KeycodeType,
  getLightingDefinition,
  isVIADefinitionV3,
  isVIADefinitionV2,
  VIADefinitionV3,
} from '@the-via/reader';
import {OverflowCell, SubmenuOverflowCell, SubmenuRow} from '../grid';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {
  getBasicKeyToByte,
  getSelectedDefinition,
  getSelectedKeyDefinitions,
} from 'src/store/definitionsSlice';
import {
  getSelectedConnectedDevice,
  getSelectedKeyboardAPI,
} from 'src/store/devicesSlice';
import {
  getSelectedKey,
  getSelectedKeymap,
  getSelectedRawLayers,
  saveRawKeymapToDevice,
  updateKey as updateKeyAction,
  updateSelectedKey,
} from 'src/store/keymapSlice';
import {getExpressions, getMacroCount, saveMacros} from 'src/store/macrosSlice';
import {
  disableGlobalHotKeys,
  enableGlobalHotKeys,
  getDisableFastRemap,
} from 'src/store/settingsSlice';
import {getNextKey} from 'src/utils/keyboard-rendering';
import {IconButtonContainer} from '../../inputs/icon-button';
import {IconButtonTooltip} from '../../inputs/tooltip';
import stringify from 'json-stringify-pretty-compact';
import deprecatedKeycodes from '../../../utils/key-to-byte/deprecated-keycodes';
import {UploadButton} from '../../inputs/upload-button';
import {PaneSelector} from '../pane';
import {KeyboardIcon} from '../../icons/milktype/index';

type ViaSaveFile = {
  name: string;
  vendorProductId: number;
  layers: string[][];
  macros?: string[];
  encoders?: [string, string][][];
};

const isViaSaveFile = (obj: any): obj is ViaSaveFile =>
  obj && obj.name && obj.layers && obj.vendorProductId;

const KeycodeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 64px);
  grid-auto-rows: 64px;
  justify-content: center;
  grid-gap: 10px;
`;

const MenuContainer = styled.div`
  padding: 15px 20px 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Keycode = styled(Button)<{disabled: boolean}>`
  width: 50px;
  height: 50px;
  line-height: 18px;
  border-radius: 64px;
  font-size: 14px;
  background: var(--bg_control);
  color: var(--color_label-highlighted);
  margin: 0;
  box-shadow: none;
  position: relative;
  border-radius: 10px;
  &:hover {
    border-color: var(--color_accent);
    transform: translate3d(0, -2px, 0);
  }
  ${(props: any) => props.disabled && `cursor:not-allowed;filter:opacity(50%);`}
`;

const KeycodeContent = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const CustomKeycode = styled(Button)`
  width: 50px;
  height: 50px;
  line-height: 18px;
  border-radius: 10px;
  font-size: 14px;
  background: var(--color-accent-100);
  border-color: var(--color_inside_accent);
  color: var(--color-white-80);
  margin: 0;
`;

const KeycodeContainer = styled.div`
  padding: 12px;
  padding-bottom: 30px;
`;

const KeycodeDesc = styled.div`
  position: fixed;
  bottom: 0;
  background: var(--color-accent-60);
  color: var(--color-white-100);
  box-sizing: border-box;
  transition: opacity 0.4s ease-out;
  height: 25px;
  width: 100%;
  line-height: 14px;
  padding: 5px;
  font-size: 14px;
  opacity: 1;
  pointer-events: none;
  &:empty {
    opacity: 0;
  }
`;

const LoadSaveContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const generateKeycodeCategories = (
  basicKeyToByte: Record<string, number>,
  numMacros: number = 16,
) => getKeycodes(numMacros).concat(getOtherMenu(basicKeyToByte));

const maybeFilter = <M extends Function>(maybe: boolean, filter: M) =>
  maybe ? () => true : filter;

export const Pane = () => {
  const selectedKey = useAppSelector(getSelectedKey);
  const dispatch = useAppDispatch();
  const keys = useAppSelector(getSelectedKeyDefinitions);
  useEffect(
    () => () => {
      dispatch(updateSelectedKey(null));
    },
    [],
  ); // componentWillUnmount equiv

  if (selectedKey !== null && keys[selectedKey].ei !== undefined) {
    return <EncoderPane.Pane />;
  }
  return <KeycodePane />;
};

export const KeycodePane = () => {
  const dispatch = useAppDispatch();
  const api = useAppSelector(getSelectedKeyboardAPI);
  const rawLayers = useAppSelector(getSelectedRawLayers);
  const expressions = useAppSelector(getExpressions);
  const {basicKeyToByte, byteToKey} = useAppSelector(getBasicKeyToByte);
  const macros = useAppSelector((state: any) => state.macros);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const selectedDevice = useAppSelector(getSelectedConnectedDevice);
  const matrixKeycodes = useAppSelector(getSelectedKeymap);
  const selectedKey = useAppSelector(getSelectedKey);
  const disableFastRemap = useAppSelector(getDisableFastRemap);
  const selectedKeyDefinitions = useAppSelector(getSelectedKeyDefinitions);
  const macroCount = useAppSelector(getMacroCount);

  const KeycodeCategories = useMemo(
    () => generateKeycodeCategories(basicKeyToByte, macroCount),
    [basicKeyToByte, macroCount],
  );

  // TODO: improve typing so we can get rid of this
  if (!selectedDefinition || !selectedDevice || !matrixKeycodes || !api) {
    return null;
  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState(
    KeycodeCategories[0].id,
  );
  const [mouseOverDesc, setMouseOverDesc] = useState<string | null>(null);
  const [showKeyTextInputModal, setShowKeyTextInputModal] = useState(false);

  const getEnabledMenus = (): IKeycodeMenu[] => {
    if (isVIADefinitionV3(selectedDefinition)) {
      return getEnabledMenusV3(selectedDefinition);
    }
    const {lighting, customKeycodes} = selectedDefinition;
    const {keycodes} = getLightingDefinition(lighting);
    return KeycodeCategories.filter(
      maybeFilter(
        keycodes === KeycodeType.QMK,
        ({id}) => id !== 'qmk_lighting',
      ),
    )
      .filter(
        maybeFilter(keycodes === KeycodeType.WT, ({id}) => id !== 'lighting'),
      )
      .filter(
        maybeFilter(
          typeof customKeycodes !== 'undefined',
          ({id}) => id !== 'custom',
        ),
      );
  };
  const getEnabledMenusV3 = (definition: VIADefinitionV3): IKeycodeMenu[] => {
    const keycodes = ['default' as const, ...(definition.keycodes || [])];
    const allowedKeycodes = keycodes.flatMap((keycodeName) =>
      categoriesForKeycodeModule(keycodeName),
    );
    if ((selectedDefinition.customKeycodes || []).length !== 0) {
      allowedKeycodes.push('custom');
    }
    return KeycodeCategories.filter((category) =>
      allowedKeycodes.includes(category.id),
    );
  };

  const renderMacroError = () => {
    return (
      <ErrorMessage>
        Your current firmware does not support macros. Install the latest
        firmware for your device.
      </ErrorMessage>
    );
  };

  const renderCategories = () => {
    return (
      <MenuContainer>
        {getEnabledMenus().map(({id, label}) => (
          <SubmenuRow
            $selected={id === selectedCategory}
            onClick={() => setSelectedCategory(id)}
            key={id}
          >
            {label.toLowerCase()}
          </SubmenuRow>
        ))}
      </MenuContainer>
    );
  };

  const renderKeyInputModal = () => {
    dispatch(disableGlobalHotKeys());

    return (
      <KeycodeModal
        defaultValue={
          selectedKey !== null ? matrixKeycodes[selectedKey] : undefined
        }
        onExit={() => {
          dispatch(enableGlobalHotKeys());
          setShowKeyTextInputModal(false);
        }}
        onConfirm={(keycode) => {
          dispatch(enableGlobalHotKeys());
          updateKey(keycode);
          setShowKeyTextInputModal(false);
        }}
      />
    );
  };

  const updateKey = (value: number) => {
    if (selectedKey !== null) {
      dispatch(updateKeyAction(selectedKey, value));
      dispatch(
        updateSelectedKey(
          disableFastRemap || !selectedKeyDefinitions
            ? null
            : getNextKey(selectedKey, selectedKeyDefinitions),
        ),
      );
    }
  };

  const handleClick = (code: string, i: number) => {
    if (code == 'text') {
      setShowKeyTextInputModal(true);
    } else {
      return (
        keycodeInMaster(code, basicKeyToByte) &&
        updateKey(getByteForCode(code, basicKeyToByte))
      );
    }
  };

  const renderKeycode = (keycode: IKeycode, index: number) => {
    const {code, title, name, shortName} = keycode;
    const content = (shortName || name).toLowerCase();
    return (
      <Keycode
        key={code}
        disabled={!keycodeInMaster(code, basicKeyToByte) && code != 'text'}
        onClick={() => handleClick(code, index)}
        onMouseOver={() =>
          setMouseOverDesc(
            title
              ? `${code}: ${title.toLowerCase()}`
              : `${code}: ${name.toLowerCase()}`,
          )
        }
        onMouseOut={() => setMouseOverDesc(null)}
      >
        <KeycodeContent>{content}</KeycodeContent>
      </Keycode>
    );
  };

  const renderCustomKeycode = () => {
    return (
      <CustomKeycode
        key="customKeycode"
        onClick={() => selectedKey !== null && handleClick('text', 0)}
        onMouseOver={() => setMouseOverDesc('enter any qmk keycode')}
        onMouseOut={() => setMouseOverDesc(null)}
      >
        any
      </CustomKeycode>
    );
  };

  const renderSelectedCategory = (
    keycodes: IKeycode[],
    selectedCategory: string,
  ) => {
    const keycodeListItems = keycodes.map((keycode, i) =>
      renderKeycode(keycode, i),
    );
    switch (selectedCategory) {
      case 'macro': {
        return !macros.isFeatureSupported ? (
          renderMacroError()
        ) : (
          <KeycodeList>{keycodeListItems}</KeycodeList>
        );
      }
      case 'special': {
        return (
          <KeycodeList>
            {keycodeListItems.concat(renderCustomKeycode())}
          </KeycodeList>
        );
      }
      case 'custom': {
        if (
          (!isVIADefinitionV2(selectedDefinition) &&
            !isVIADefinitionV3(selectedDefinition)) ||
          !selectedDefinition.customKeycodes
        ) {
          return null;
        }
        return (
          <KeycodeList>
            {selectedDefinition.customKeycodes.map((keycode, idx) => {
              return renderKeycode(
                {
                  ...keycode,
                  code: `CUSTOM(${idx})`,
                },
                idx,
              );
            })}
          </KeycodeList>
        );
      }
      default: {
        return <KeycodeList>{keycodeListItems}</KeycodeList>;
      }
    }
  };

  const getEncoderValues = async () => {
    const {layouts} = selectedDefinition;
    const {keys, optionKeys} = layouts;
    const encoders = [
      ...keys,
      ...Object.values(optionKeys)
        .flatMap((a) => Object.values(a))
        .flat(),
    ]
      .filter((a) => 'ei' in a)
      .map((a) => a.ei as number);
    if (encoders.length > 0) {
      const maxEncoder = Math.max(...encoders) + 1;
      const numberOfLayers = rawLayers.length;
      const encoderValues = await Promise.all(
        Array(maxEncoder)
          .fill(0)
          .map((_, i) =>
            Promise.all(
              Array(numberOfLayers)
                .fill(0)
                .map((_, j) =>
                  Promise.all([
                    api.getEncoderValue(j, i, false),
                    api.getEncoderValue(j, i, true),
                  ]).then(
                    (a) =>
                      a.map(
                        (keyByte) =>
                          getCodeForByte(keyByte, basicKeyToByte, byteToKey) ||
                          '',
                      ) as [string, string],
                  ),
                ),
            ),
          ),
      );
      return encoderValues;
    } else {
      return [];
    }
  };

  const saveLayout = async () => {
    const {name, vendorProductId} = selectedDefinition;
    const suggestedName =
      name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '.layout.json';
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
      });
      const encoderValues = await getEncoderValues();
      const saveFile: ViaSaveFile = {
        name,
        vendorProductId,
        macros: [...expressions],
        layers: rawLayers.map(
          (layer: {keymap: number[]}) =>
            layer.keymap.map(
              (keyByte: number) =>
                getCodeForByte(keyByte, basicKeyToByte, byteToKey) || '',
            ), // TODO: should empty string be empty keycode instead?
        ),
        encoders: encoderValues,
      };

      const content = stringify(saveFile);
      const blob = new Blob([content], {type: 'application/json'});
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      console.log('User cancelled save file request');
    }

    /*
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFilename;

    link.click();
    URL.revokeObjectURL(url);
*/
  };

  const loadLayout = ([file]: Blob[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const reader = new FileReader();

    reader.onabort = () => setErrorMessage('File reading was cancelled.');
    reader.onerror = () => setErrorMessage('Failed to read file.');

    reader.onload = async () => {
      const saveFile = JSON.parse((reader as any).result.toString());
      if (!isViaSaveFile(saveFile)) {
        setErrorMessage('Could not load file: invalid data.');
        return;
      }

      if (saveFile.vendorProductId !== selectedDefinition.vendorProductId) {
        setErrorMessage(
          `Could not import layout. This file was created for a different keyboard: ${saveFile.name}`,
        );
        return;
      }

      if (
        saveFile.layers.findIndex(
          (layer, idx) => layer.length !== rawLayers[idx].keymap.length,
        ) > -1
      ) {
        setErrorMessage(
          'Could not import layout: incorrect number of keys in one or more layers.',
        );
        return;
      }

      if (macros.isFeatureSupported && saveFile.macros) {
        if (saveFile.macros.length !== expressions.length) {
          setErrorMessage(
            'Could not import layout: incorrect number of macros.',
          );
          return;
        }

        dispatch(saveMacros(selectedDevice, saveFile.macros));
      }

      const keymap: number[][] = saveFile.layers.map((layer) =>
        layer.map((key) =>
          getByteForCode(`${deprecatedKeycodes[key] ?? key}`, basicKeyToByte),
        ),
      );

      // John you drongo, don't trust the compiler, dispatches are totes awaitable for async thunks
      await dispatch(saveRawKeymapToDevice(keymap, selectedDevice));

      if (saveFile.encoders) {
        await Promise.all(
          saveFile.encoders.map((encoder, id) =>
            Promise.all(
              encoder.map((layer, layerId) =>
                Promise.all([
                  api.setEncoderValue(
                    layerId,
                    id,
                    false,
                    getByteForCode(
                      `${deprecatedKeycodes[layer[0]] ?? layer[0]}`,
                      basicKeyToByte,
                    ),
                  ),
                  api.setEncoderValue(
                    layerId,
                    id,
                    true,
                    getByteForCode(
                      `${deprecatedKeycodes[layer[1]] ?? layer[1]}`,
                      basicKeyToByte,
                    ),
                  ),
                ]),
              ),
            ),
          ),
        );
      }

      setSuccessMessage('Successfully updated layout!');
    };

    reader.readAsBinaryString(file);
  };

  const selectedCategoryKeycodes = KeycodeCategories.find(
    ({id}) => id === selectedCategory,
  )?.keycodes as IKeycode[];

  return (
    <>
      <SubmenuOverflowCell>
        <PaneSelector />
        {renderCategories()}
        <LoadSaveContainer>
          <UploadButton onLoad={loadLayout}>
            <LoadIcon color={'var(--color-white-80)'} width={'1em'} />
            <IconButtonTooltip>Load</IconButtonTooltip>
          </UploadButton>
          <IconButtonContainer onClick={saveLayout}>
            <DownloadIcon color={'var(--color-white-80)'} width={'1em'} />
            <IconButtonTooltip>Save</IconButtonTooltip>
          </IconButtonContainer>
        </LoadSaveContainer>
        {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        {successMessage ? (
          <SuccessMessage>{successMessage}</SuccessMessage>
        ) : null}
      </SubmenuOverflowCell>
      <OverflowCell>
        <KeycodeContainer>
          {renderSelectedCategory(selectedCategoryKeycodes, selectedCategory)}
        </KeycodeContainer>
        <KeycodeDesc>{mouseOverDesc}</KeycodeDesc>
        {showKeyTextInputModal && renderKeyInputModal()}
      </OverflowCell>
    </>
  );
};

export const Icon = KeyboardIcon;
export const Title = title;
