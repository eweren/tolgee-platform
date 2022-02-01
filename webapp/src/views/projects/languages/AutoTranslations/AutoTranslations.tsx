import { useEffect, useRef, useState } from 'react';
import {
  makeStyles,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import { useTranslate } from '@tolgee/react';
import { Formik, FormikProps } from 'formik';

import {
  useApiQuery,
  useApiMutation,
  matchUrlPrefix,
} from 'tg.service/http/useQueryApi';
import { useProject } from 'tg.hooks/useProject';
import { useGlobalLoading } from 'tg.component/GlobalLoading';
import { SmoothProgress } from 'tg.component/SmoothProgress';
import { components } from 'tg.service/apiSchema.generated';
import { useQueryClient } from 'react-query';

type AutoTranslationSettingsDto =
  components['schemas']['AutoTranslationSettingsDto'];

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: theme.spacing(0.5, 0),
  },
  hint: {
    color: theme.palette.text.secondary,
  },
  settings: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0.5, 1),
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
}));

export const AutoTranslations = () => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const project = useProject();
  const t = useTranslate();
  const [formInstance, setFormInstance] = useState(0);
  const formRef = useRef<FormikProps<any>>();

  const settings = useApiQuery({
    url: '/v2/projects/{projectId}/auto-translation-settings',
    method: 'get',
    path: { projectId: project.id },
  });

  const updateSettings = useApiMutation({
    url: '/v2/projects/{projectId}/auto-translation-settings',
    method: 'put',
  });

  const lastUpdateRef = useRef<Promise<any>>();
  const applyUpdate = (data: AutoTranslationSettingsDto) => {
    const promise = updateSettings
      .mutateAsync({
        path: { projectId: project.id },
        content: { 'application/json': data },
      })
      .then((data) => {
        if (promise === lastUpdateRef.current) {
          queryClient.setQueriesData(
            matchUrlPrefix(
              '/v2/projects/{projectId}/auto-translation-settings'
            ),
            {
              version: Math.random(), // force data change
              ...data,
            }
          );
        }
      })
      .catch(() => {
        setFormInstance((i) => i + 1);
      });
    lastUpdateRef.current = promise;
  };

  useEffect(() => {
    formRef.current?.resetForm();
  }, [settings.data]);

  useGlobalLoading(settings.isFetching);

  const isUpdating = updateSettings.isLoading;

  return settings.data ? (
    <div className={classes.container}>
      <Typography variant="caption" className={classes.hint}>
        {t('project_languages_new_keys_hint')}
      </Typography>
      <Formik
        key={formInstance}
        initialValues={{
          usingTranslationMemory: settings.data.usingTranslationMemory,
          usingMachineTranslation: settings.data.usingMachineTranslation,
        }}
        enableReinitialize={true}
        onSubmit={() => {}}
        validate={(values) => {
          applyUpdate(values);
        }}
        validateOnChange
      >
        {(form) => {
          formRef.current = form;
          return (
            <div className={classes.settings}>
              <FormControlLabel
                name="usingTranslationMemory"
                data-cy="languages-auto-translation-memory"
                label={t({
                  key: 'project_languages_new_keys_translation_memory_switch',
                  defaultValue: 'Enable translation memory',
                })}
                checked={form.values.usingTranslationMemory}
                onChange={form.handleChange}
                control={<Checkbox />}
              />
              <FormControlLabel
                name="usingMachineTranslation"
                data-cy="languages-auto-machine-translation"
                label={t({
                  key: 'project_languages_new_keys_machine_translations_switch',
                  defaultValue:
                    'Enable machine translation with primary provider',
                })}
                checked={form.values.usingMachineTranslation}
                onChange={form.handleChange}
                control={<Checkbox />}
              />
            </div>
          );
        }}
      </Formik>
      <div className={classes.loading}>
        <SmoothProgress loading={isUpdating} />
      </div>
    </div>
  ) : null;
};
