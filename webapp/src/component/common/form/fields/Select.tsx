import { default as React, FunctionComponent, ReactNode } from 'react';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  Select as MUISelect,
  Theme,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useField } from 'formik';

interface PGSelectProps {
  name: string;
  label?: ReactNode;
  renderValue?: (v: any) => ReactNode;
}

type Props = PGSelectProps & FormControlProps;

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    select: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      minWidth: 120,
    },
  })
);

export const Select: FunctionComponent<Props> = (props) => {
  const classes = useStyles({});

  const [field, meta, helpers] = useField(props.name);

  const { renderValue, ...formControlProps } = props;

  return (
    <FormControl
      className={classes.select}
      error={!!meta.error}
      {...formControlProps}
    >
      {props.label && (
        <InputLabel id={'select_' + field.name + '_label'}>
          {props.label}
        </InputLabel>
      )}
      <MUISelect
        data-cy="global-form-select"
        name={field.name}
        labelId={'select_' + field.name + '_label'}
        value={field.value}
        label={props.label}
        onChange={(e) => helpers.setValue(e.target.value)}
        renderValue={
          typeof renderValue === 'function'
            ? renderValue
            : (value) => value as ReactNode
        }
      >
        {props.children}
      </MUISelect>
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};
