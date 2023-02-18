import { Component, onMount } from 'solid-js';

type Props = {
  title: string;
};

const SEO: Component<Props> = ({ title }) => {
  onMount(() => {
    document.title = title;
  });

  return null;
};

export default SEO;
