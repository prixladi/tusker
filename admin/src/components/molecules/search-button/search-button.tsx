import { Component, JSX } from 'solid-js';

import classes from './search-button.module.scss';

type Props = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const SearchButton: Component<Props> = (props) => (
  <button {...props} class={classes.button}>🔍</button>
);

export default SearchButton;
