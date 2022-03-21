import { Divider } from '@mui/material';
import List from '@mui/material/List';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useTranslate } from '@tolgee/react';
import { useSelector } from 'react-redux';
import { container } from 'tsyringe';

import {
  ExportIcon,
  ImportIcon,
  ProjectsIcon,
  SettingsIcon,
  TranslationIcon,
  UserAddIcon,
  UserSettingIcon,
} from 'tg.component/CustomIcons';
import { LINKS, PARAMS } from 'tg.constants/links';
import { useConfig } from 'tg.hooks/useConfig';
import { useProject } from 'tg.hooks/useProject';
import { ProjectPermissionType } from 'tg.service/response.types';
import { GlobalActions } from 'tg.store/global/GlobalActions';
import { AppState } from 'tg.store/index';

import { SideMenu } from './SideMenu';
import { SideMenuItem } from './SideMenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { Devices } from '@mui/icons-material';

const actions = container.resolve(GlobalActions);

export const ProjectMenu = ({ id }) => {
  const projectDTO = useProject();
  const config = useConfig();

  const open = useSelector((state: AppState) => state.global.sideMenuOpen);

  const t = useTranslate();

  return (
    <SideMenu
      onSideMenuToggle={() => actions.toggleSideMenu.dispatch()}
      open={open}
    >
      <div data-cy="project-menu-items">
        <List>
          <SideMenuItem
            linkTo={LINKS.PROJECTS.build({ [PARAMS.PROJECT_ID]: id })}
            icon={<ProjectsIcon />}
            text={t('project_menu_projects')}
          />
        </List>
        <Divider />
        <List>
          <SideMenuItem
            linkTo={LINKS.PROJECT_TRANSLATIONS.build({
              [PARAMS.PROJECT_ID]: id,
            })}
            icon={<TranslationIcon />}
            text={t('project_menu_translations')}
            matchAsPrefix
          />
        </List>
        <Divider />
        <List>
          {projectDTO.computedPermissions === ProjectPermissionType.MANAGE && (
            <>
              <SideMenuItem
                linkTo={LINKS.PROJECT_EDIT.build({
                  [PARAMS.PROJECT_ID]: id,
                })}
                matchAsPrefix
                icon={<SettingsIcon />}
                text={t('project_menu_project_settings')}
              />
              <SideMenuItem
                linkTo={LINKS.PROJECT_LANGUAGES.build({
                  [PARAMS.PROJECT_ID]: id,
                })}
                matchAsPrefix
                icon={<LanguageIcon />}
                text={t('project_menu_languages')}
              />
              {config.authentication && (
                <>
                  <SideMenuItem
                    linkTo={LINKS.PROJECT_INVITATION.build({
                      [PARAMS.PROJECT_ID]: id,
                    })}
                    icon={<UserAddIcon />}
                    text={t('project_menu_invite_user')}
                  />
                  <SideMenuItem
                    linkTo={LINKS.PROJECT_PERMISSIONS.build({
                      [PARAMS.PROJECT_ID]: id,
                    })}
                    icon={<UserSettingIcon />}
                    text={t('project_menu_permissions')}
                  />
                </>
              )}

              <SideMenuItem
                linkTo={LINKS.PROJECT_IMPORT.build({
                  [PARAMS.PROJECT_ID]: id,
                })}
                icon={<ImportIcon />}
                text={t('project_menu_import')}
              />
            </>
          )}
          <SideMenuItem
            linkTo={LINKS.PROJECT_EXPORT.build({
              [PARAMS.PROJECT_ID]: id,
            })}
            icon={<ExportIcon />}
            text={t('project_menu_export')}
          />
          <SideMenuItem
            linkTo={LINKS.PROJECT_INTEGRATE.build({
              [PARAMS.PROJECT_ID]: id,
            })}
            icon={<Devices />}
            text={t('project_menu_integrate')}
          />
        </List>
        {!config.authentication && (
          <>
            <Divider />
            <List>
              <SideMenuItem
                linkTo={LINKS.USER_API_KEYS.build()}
                icon={<VpnKeyIcon />}
                text={t('project_menu_api_keys')}
              />
            </List>
          </>
        )}
      </div>
    </SideMenu>
  );
};
