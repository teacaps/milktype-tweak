import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {shallowEqual} from 'react-redux';
import {TestKeyState} from 'src/types/types';
import {getDarkenedColor} from 'src/utils/color-math';
import {CSSVarObject} from 'src/utils/keyboard-rendering';
import styled from 'styled-components';
import {Keycap2DTooltip} from '../../inputs/tooltip';
import {ComboKeycap} from './combo-keycap';
import {EncoderKey} from './encoder';
import {
  CanvasContainer,
  KeycapContainer,
  TestOverlay,
  TooltipContainer,
} from './keycap-base';
import {
  KeycapState,
  TwoStringKeycapProps,
  DisplayMode,
} from 'src/types/keyboard-rendering';

const getMacroData = ({
  macroExpression,
  label,
}: {
  macroExpression?: string;
  label: string;
}) =>
  label && label.length > 15
    ? label
    : macroExpression && macroExpression.length
      ? macroExpression
      : null;

const paintDebugLines = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (context == null) {
    return;
  }
  context.strokeStyle = 'magenta';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width, 0);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.lineTo(0, 0);
  context.stroke();
};

const paintKeycapLabel = (
  canvas: HTMLCanvasElement,
  legendColor: string,
  label: any,
) => {
  const context = canvas.getContext('2d');
  if (context == null) {
    return;
  }
  const dpi = devicePixelRatio;
  const [canvasWidth, canvasHeight] = [canvas.width, canvas.height];
  canvas.width = canvasWidth * dpi;
  canvas.height = canvasHeight * dpi;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  const fontSize = 14;
  const fontHeight = 0.5 * fontSize;

  context.scale(dpi, dpi);

  const fontFamily = 'Figtree, Arial Rounded MT, Arial Rounded MT Bold, Arial';
  context.font = `500 ${fontSize}px ${fontFamily}`;

  // Define a clipping path for the top face, so text is not drawn on the side.
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width, 0);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.lineTo(0, 0);
  context.clip();

  context.fillStyle = legendColor;
  if (label === undefined) {
  } else if (label.topLabel && label.bottomLabel) {
    const gapBetweenLabels = 1.25 * fontHeight;

    const topLabelMetrics = context.measureText(label.topLabel.toLowerCase());
    const bottomLabelMetrics = context.measureText(
      label.bottomLabel.toLowerCase(),
    );

    const totalLabelHeight =
      topLabelMetrics.actualBoundingBoxAscent +
      bottomLabelMetrics.actualBoundingBoxAscent +
      gapBetweenLabels;
    const yMargin = (canvasHeight - totalLabelHeight) / 2;

    const topLabelOffsets: [number, number] = [
      canvasWidth / 2 - topLabelMetrics.width / 2,
      yMargin + topLabelMetrics.actualBoundingBoxAscent,
    ];
    const bottomLabelOffsets: [number, number] = [
      canvasWidth / 2 - bottomLabelMetrics.width / 2,
      yMargin + totalLabelHeight,
    ];

    context.fillText(label.topLabel.toLowerCase(), ...topLabelOffsets);
    context.fillText(label.bottomLabel.toLowerCase(), ...bottomLabelOffsets);
  } else if (label.centerLabel) {
    const metrics = context.measureText(label.centerLabel.toLowerCase());
    const xMargin = (canvasWidth - metrics.width) / 2;
    const yMargin =
      (canvasHeight - metrics.actualBoundingBoxAscent) / 2 +
      metrics.actualBoundingBoxAscent;
    context.fillText(label.label.toLowerCase(), xMargin, yMargin);
    // return if label would have overflowed so that we know to show tooltip
    return xMargin < 4 || yMargin < 4;
  } else if (typeof label.label === 'string') {
    const metrics = context.measureText(label.label.toLowerCase());
    const xMargin = (canvasWidth - metrics.width) / 2;
    const yMargin =
      (canvasHeight - metrics.actualBoundingBoxAscent) / 2 +
      metrics.actualBoundingBoxAscent;
    context.fillText(label.label.toLowerCase(), xMargin, yMargin);
  }
};

const paintKeycap = (
  canvas: HTMLCanvasElement,
  textureWidth: number,
  textureHeight: number,
  legendColor: string,
  label: any,
) => {
  const [canvasWidth, canvasHeight] = [
    CSSVarObject.keyXPos,
    CSSVarObject.keyYPos,
  ];
  canvas.width = canvasWidth * textureWidth - CSSVarObject.keyXSpacing;
  canvas.height = canvasHeight * textureHeight - CSSVarObject.keyYSpacing;

  const context = canvas.getContext('2d');
  if (context == null) {
    return;
  }

  // Fill the canvas with the keycap background color
  //context.fillStyle = bgColor;
  //context.fillRect(0, 0, canvas.width, canvas.height);

  // Leaving this here for future maintenance.
  // This draws lines around the keycap edge and the top face edge,
  // *or* a clipped area within it when keycaps are large, vertical or odd shapes.
  const debug = false;
  if (debug) {
    paintDebugLines(canvas);
  }

  return paintKeycapLabel(canvas, legendColor, label);
};

export const Keycap: React.FC<TwoStringKeycapProps> = React.memo((props) => {
  const {
    label,
    scale,
    color,
    selected,
    disabled,
    mode,
    rotation,
    keyState,
    shouldRotate,
    textureWidth,
    textureHeight,
    skipFontCheck,
    idx,
  } = props;
  const macroData = label && getMacroData(label);
  const [overflowsTexture, setOverflowsTexture] = useState(false);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = React.useCallback(() => {
    if (
      canvasRef.current &&
      color &&
      label &&
      (document.fonts.check('500 16px"Figtree"', label.label) || skipFontCheck)
    ) {
      // Only render label if it is available
      const doesOverflow = paintKeycap(
        canvasRef.current,
        textureWidth,
        textureHeight,
        color.t,
        label,
      );
      setOverflowsTexture(!!doesOverflow);
    }
  }, [
    canvasRef.current,
    textureWidth,
    label && label.key,
    scale[0],
    scale[1],
    color && color.t,
    color && color.c,
    shouldRotate,
  ]);
  useEffect(redraw, [
    label && label.key,
    skipFontCheck,
    color && color.c,
    color && color.t,
  ]);

  useEffect(() => {
    document.fonts.addEventListener('loadingdone', redraw);
    return () => {
      document.fonts.removeEventListener('loadingdone', redraw);
    };
  }, []);

  // Set Z to half the total height so that keycaps are at the same level since the center
  // is in the middle and each row has a different height
  const [zDown, zUp] = [-8, 0];
  const pressedState =
    DisplayMode.Test === mode
      ? TestKeyState.KeyDown === keyState
        ? KeycapState.Pressed
        : KeycapState.Unpressed
      : hovered || selected
        ? KeycapState.Pressed
        : KeycapState.Unpressed;
  const [keycapZ] =
    pressedState === KeycapState.Pressed
      ? [zDown, rotation[2]]
      : [zUp, rotation[2] + Math.PI * Number(shouldRotate)];
  const wasPressed = keyState === TestKeyState.KeyUp;
  const keycapColor =
    DisplayMode.Test === mode
      ? pressedState === KeycapState.Unpressed
        ? wasPressed
          ? 'mediumvioletred'
          : 'lightgrey'
        : 'mediumvioletred'
      : pressedState === KeycapState.Unpressed
        ? 'lightgrey'
        : 'lightgrey';
  const keycapOpacity =
    pressedState === KeycapState.Unpressed ? (wasPressed ? 0.4 : 0) : 0.6;

  const [onClick, onPointerOver, onPointerOut, onPointerDown] = useMemo(() => {
    const noop = () => {};
    return disabled
      ? [noop, noop, noop, noop]
      : props.mode === DisplayMode.ConfigureColors
        ? [
            noop,
            (evt: React.MouseEvent) => {
              if (props.onPointerOver) {
                props.onPointerOver(evt, idx);
              }
            },
            noop,
            (evt: React.MouseEvent) => {
              if (props.onPointerDown) {
                props.onPointerDown(evt, idx);
              }
            },
          ]
        : [
            (evt: React.MouseEvent) => props.onClick(evt, idx),
            (evt: React.MouseEvent) => {
              if (props.onPointerOver) {
                props.onPointerOver(evt, idx);
              }
              hover(true);
            },
            () => hover(false),
            (evt: React.MouseEvent) => {
              if (props.onPointerDown) {
                props.onPointerDown(evt, idx);
              }
            },
          ];
  }, [
    disabled,
    props.onClick,
    props.onPointerDown,
    props.onPointerOver,
    hover,
    idx,
    mode,
  ]);
  return shouldRotate ? (
    <EncoderKey
      onClick={onClick}
      size={textureWidth * CSSVarObject.keyWidth}
      style={{
        transform: `translate(${
          props.position[0] -
          (CSSVarObject.keyWidth * textureWidth - CSSVarObject.keyWidth) / 2
        }px,${
          (textureWidth * (CSSVarObject.keyHeight - CSSVarObject.keyWidth)) /
            2 +
          props.position[1] -
          (CSSVarObject.keyHeight * textureHeight - CSSVarObject.keyHeight) / 2
        }px) rotate(${-props.rotation[2]}rad)`,
        borderRadius: 3,
        color: props.color.c,
      }}
    />
  ) : props.clipPath ? (
    <ComboKeycap
      {...props}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      keycapZ={keycapZ}
      keycapOpacity={keycapOpacity}
      keycapColor={keycapColor}
      canvasRef={canvasRef}
      macroData={macroData}
      overflowsTexture={overflowsTexture}
      style={{
        transform: `translate(${
          CSSVarObject.keyWidth / 2 +
          props.position[0] -
          (CSSVarObject.keyXPos * textureWidth - CSSVarObject.keyXSpacing) / 2
        }px,${
          CSSVarObject.keyHeight / 2 +
          props.position[1] -
          (CSSVarObject.keyYPos * textureHeight - CSSVarObject.keyYSpacing) / 2
        }px) rotate(${-props.rotation[2]}rad)`,
        width: textureWidth * CSSVarObject.keyXPos - CSSVarObject.keyXSpacing,
        height: textureHeight * CSSVarObject.keyYPos - CSSVarObject.keyYSpacing,
      }}
    />
  ) : (
    <>
      <KeycapContainer
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        style={{
          transform: `translate(${
            CSSVarObject.keyWidth / 2 +
            props.position[0] -
            (CSSVarObject.keyXPos * textureWidth - CSSVarObject.keyXSpacing) / 2
          }px,${
            CSSVarObject.keyHeight / 2 +
            props.position[1] -
            (CSSVarObject.keyYPos * textureHeight - CSSVarObject.keyYSpacing) /
              2
          }px) rotate(${-props.rotation[2]}rad)`,
          width: textureWidth * CSSVarObject.keyXPos - CSSVarObject.keyXSpacing,
          height:
            textureHeight * CSSVarObject.keyYPos - CSSVarObject.keyYSpacing,
          cursor: !disabled ? 'pointer' : 'initial',
        }}
      >
        <GlowContainer
          $selected={selected}
          style={{
            animation: disabled
              ? 'initial' // This prevents the hover animation from firing when the keycap can't be interacted with
              : selected
                ? '.75s infinite alternate select-glow'
                : '',
            background: getDarkenedColor(props.color.c, 0.8),
            transform: `perspective(100px) translateZ(${keycapZ}px)`,
            borderRadius: 12 /*h*/,
            width:
              textureWidth * CSSVarObject.keyXPos - CSSVarObject.keyXSpacing,
            height:
              textureHeight * CSSVarObject.keyYPos - CSSVarObject.keyYSpacing,
          }}
        >
          {DisplayMode.Test === mode ? (
            <TestOverlay
              style={{
                background: keycapColor,
                opacity: keycapOpacity,
              }}
            ></TestOverlay>
          ) : null}
          <CanvasContainer
            style={{
              borderRadius: 12 /*h*/,
              background: props.color.c,
              height: '100%',
            }}
          >
            <canvas ref={canvasRef} style={{}} />
          </CanvasContainer>
        </GlowContainer>
        {(macroData || overflowsTexture) && (
          <TooltipContainer $rotate={rotation[2]}>
            <Keycap2DTooltip>
              {macroData || (label && label.tooltipLabel)}
            </Keycap2DTooltip>
          </TooltipContainer>
        )}
      </KeycapContainer>
    </>
  );
}, shallowEqual);

const GlowContainer = styled.div<{$selected: boolean}>`
  box-sizing: border-box;
  transition: transform 0.2s ease-out;
  animation: ${(p) =>
    p.$selected ? '.75s infinite alternate select-glow' : 'initial'};
  &:hover {
    transform: perspective(100px) translateZ(-5px);
    animation: 0.5s 1 forwards select-glow;
  }
`;
