import React from 'react';
import Select, {Props} from 'react-select';
const customStyles = {
  option: (provided: any, state: any) => {
    return {
      ...provided,
      '&:hover': {
        backgroundColor: state.isSelected
          ? 'var(--color_accent)'
          : 'var(--color-white-60)',
      },
      ':active': {
        backgroundColor: 'var(--color-white-60)',
      },
      background: state.isSelected
        ? 'var(--color_accent)'
        : state.isFocused
          ? 'var(--color-white-60)'
          : 'var(--color-white-80)',
      color: state.isSelected
        ? 'var(--color_inside-accent)'
        : state.isFocused
          ? 'var(--color_accent)'
          : 'var(--color_accent)',
    };
  },
  container: (provided: any) => ({
    ...provided,
    lineHeight: 'initial',
    flex: 1,
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--color_accent)',
    opacity: 0.5,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--color_accent)',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'var(--color_accent)',
  }),
  indicatorSeparator: (provided: any) => ({
    display: 'none',
  }),
  menuList: (provided: any) => ({
    ...provided,
    borderColor: 'var(--color_accent)',
    backgroundColor: 'var(--color-white-60)',
    borderRadius: 8,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'var(--color_accent)',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    ':active': {
      backgroundColor: 'var(--color-white-60)',
      borderColor: 'var(--color_accent)',
    },
    '&:hover': {
      borderColor: 'var(--color_accent)',
    },
    color: 'var(--color_accent)',
    background: 'var(--color-white-60)',
  }),
  control: (provided: any, state: any) => {
    const res = {
      ...provided,
      boxShadow: 'none',
      ':active': {
        borderColor: 'var(--color_accent)',
      },
      '&:hover': {
        borderColor: 'var(--color_accent)',
      },
      color: 'var(--color_accent)',
      borderColor: 'var(--color_accent)',
      borderWidth: 2,
      background: 'var(--color-white-60)',
      overflow: 'hidden',
      width: state.selectProps.width || 250,
      borderRadius: 8,
    };
    return res;
  },
  menu: (provided: any) => ({
    ...provided,
    borderRadius: 8,
  }),
};

export const AccentSelect: React.FC<Props> = (props) => (
  <Select {...props} styles={customStyles} />
);
