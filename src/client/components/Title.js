// @flow
import Helmet from 'react-helmet';
import React from 'react';
import { injectIntl } from 'react-intl';

type TitleProps = {|
  intl: $IntlShape,
    title: string | Object,
  values?: Object,
|};

const Title = ({ intl, title, values }: TitleProps) => (
  typeof title === 'string' ?
    <Helmet title={title} />
  :
    <Helmet title={intl.formatMessage(title, values)} />
);

export default injectIntl(Title);
