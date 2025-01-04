/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { type FC, useEffect, useState } from 'react';

type Value = boolean | number | string | null;
type ValuePropType = 'value' | 'checked';

export default function <InnerComponentPropTypes = unknown>(
  Component: FC<InnerComponentPropTypes>,
  valuePropName: ValuePropType = 'value',
  defaultValue: Value = null
): FC<InnerComponentPropTypes> {
  function WithStateWrapper(props: InnerComponentPropTypes) {
    const [valuePropValue, change] = useState<Value>(
      // @ts-ignore
      props[valuePropName] || defaultValue
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      // @ts-ignore
      handleChange(props[valuePropName] as unknown);
      // @ts-ignore
    }, [props[valuePropName]]);

    const handleChange = (value: Value) => {
      change(value);
    };

    const componentProps = {
      ...props,
      [valuePropName]: valuePropValue,
      onChange: handleChange
    };

    return <Component {...componentProps} />;
  }
  WithStateWrapper.displayName = Component.displayName;

  return WithStateWrapper;
}
