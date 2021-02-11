import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { Icon } from '../../Icon';

export interface ISearchBar {
  inputValue: string;
  onInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  inputPlaceholderLabel?: string;
  handleKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<ISearchBar> = props => {
  const { inputValue, onInputChange, inputPlaceholderLabel, handleKeyDown } = props;
  return (
    <Box
      border={{ side: 'all', size: '1px', style: 'solid', color: 'border' }}
      round="large"
      direction="row"
      align="center"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      height="2rem"
      fill="horizontal"
    >
      <TextInput
        size="xsmall"
        value={inputValue}
        onChange={onInputChange}
        placeholder={inputPlaceholderLabel}
        plain={true}
        onKeyDown={handleKeyDown}
      />
      <Icon type="search" size="xs" />
    </Box>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search profiles or topics...',
};

export { SearchBar };
