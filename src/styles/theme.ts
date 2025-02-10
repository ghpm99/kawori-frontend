"use client";

import { addStyle } from "@/util";
import { MenuTheme, ThemeConfig } from "antd";
import { AliasToken } from "antd/lib/theme/internal";


const colors = {
    brandColorPrimarPure: "#644ED0",
    brandColorPrimaryLight: "#8776DE",
    brandColorPrimaryLighter: "#CAC1F7",
    brandColorPrimaryMedium: "#4C38AB",
    brandColorPrimaryDark: "#352A6E",
    brandColorPrimaryDarker: "#281D5E",
    brandColorSecondaryPure: "#FF5B12",
    brandColorSecondaryLighter: "#FF7538",
    brandColorSecondaryLight: "#FF905E",
    brandColorSecondaryMedium: "#E65210",
    brandColorSecondaryDark: "#CC490E",
    brandColorSecondaryDarker: "#BF440D",
    brandColorPositivePure: "#1ECB4F",
    brandColorPositiveLight: "#AFE1BD",
    brandColorPositiveMedium: "#1D8D3C",
    brandColorPositiveDark: "#125A26",
    brandColornegativePure: "#FF3541",
    brandColornegativeLight: "#FFBEC2",
    brandColornegativeMedium: "#BE3A42",
    brandColornegativeDark: "#7A252A",
    brandColorstatusPositive: "#1ECB4F",
    brandColorstatusnegative: "#FF3541",
    brandColorstatusalert: "#FFAE00",
    neutralColorPurewhite: "#FFFFFF",
    neutralColorGrey1: "#F2F5F8",
    neutralColorGrey2: "#E9EBEE",
    neutralColorGrey3: "#CCD1D6",
    neutralColorGrey4: "#ACB4BA",
    neutralColorGrey5: "#737D86",
    neutralColorGrey6: "#5A646E",
    neutralColorGrey7: "#3B454F",
    neutralColorGrey8: "#22272D",
    neutralColorGrey9: "#131619",
    neutralColorGrey10: "#080A0D",
    neutralColorPureBlack: "#000000",
    themeBackgroundDark: "#2A282E",
    themeColorDark1: "#151324",
    themeColorGrey1: "#2E2D33",
    themeColorGrey4: "#1A181C",
    themeColorGreyPlaceholder: "#BDC2C7",
    themeColorGrey3: "#2A282E",
    themeColorAlert: "#6A5838",
    themeBackgroundLight: "#F0F0F0",

    themeBackground: "#2A282E",
    themeColorGrey0: "#1C1A1F",
    themeColorWhite: "#FFFFFF",
    themeColorPrimaryPure: "#23a6d5",
    themeColorPrimaryDark: "#00001b",
};

addStyle(`
    :root {
        --color-brand-color-primary-pure: ${colors.brandColorPrimarPure};
        --color-brand-color-primary-light: ${colors.brandColorPrimaryLight};
        --color-brand-color-primary-lighter: ${colors.brandColorPrimaryLighter};
        --color-brand-color-primary-medium: ${colors.brandColorPrimaryMedium};
        --color-brand-color-primary-dark: ${colors.brandColorPrimaryDark};
        --color-brand-color-primary-darker: ${colors.brandColorPrimaryDarker};
        --color-brand-color-secondary-pure: ${colors.brandColorSecondaryPure};
        --color-brand-color-secondary-lighter: ${colors.brandColorSecondaryLighter};
        --color-brand-color-secondary-light: ${colors.brandColorSecondaryLight};
        --color-brand-color-secondary-medium: ${colors.brandColorSecondaryMedium};
        --color-brand-color-secondary-dark: ${colors.brandColorSecondaryDark};
        --color-brand-color-secondary-darker: ${colors.brandColorSecondaryDarker};
        --color-brand-color-positive-pure:${colors.brandColorPositivePure} ;
        --color-brand-color-positive-light: ${colors.brandColorPositiveLight};
        --color-brand-color-positive-medium: ${colors.brandColorPositiveMedium};
        --color-brand-color-positive-dark: ${colors.brandColorPositiveDark};
        --color-brand-color-negative-pure: ${colors.brandColornegativePure};
        --color-brand-color-negative-light: ${colors.brandColornegativeLight};
        --color-brand-color-negative-medium: ${colors.brandColornegativeMedium};
        --color-brand-color-negative-dark: ${colors.brandColornegativeDark};
        --color-brand-color-status-positive: ${colors.brandColorstatusPositive};
        --color-brand-color-status-negative: ${colors.brandColorstatusnegative};
        --color-brand-color-status-alert: ${colors.brandColorstatusalert};
        --color-neutral-color-pure-white: ${colors.neutralColorPurewhite};
        --color-neutral-color-grey1: ${colors.neutralColorGrey1};
        --color-neutral-color-grey2: ${colors.neutralColorGrey2};
        --color-neutral-color-grey3: ${colors.neutralColorGrey3};
        --color-neutral-color-grey4: ${colors.neutralColorGrey4};
        --color-neutral-color-grey5: ${colors.neutralColorGrey5};
        --color-neutral-color-grey6: ${colors.neutralColorGrey6};
        --color-neutral-color-grey7: ${colors.neutralColorGrey7};
        --color-neutral-color-grey8: ${colors.neutralColorGrey8};
        --color-neutral-color-grey9: ${colors.neutralColorGrey9};
        --color-neutral-color-grey10 : ${colors.neutralColorGrey10};
        --color-neutral-color-pure-black : ${colors.neutralColorPureBlack};
        --color-theme-background-dark : ${colors.themeBackgroundDark};
        --color-theme-color-dark1 : ${colors.themeColorDark1};
        --color-theme-color-grey0 :${colors.themeColorGrey0} ;
        --color-theme-color-grey1 : ${colors.themeColorGrey1};
        --color-theme-color-grey4 :${colors.themeColorGrey4} ;
        --color-theme-color-white : ${colors.themeColorWhite};
        --color-theme-color-grey-placeholder : ${colors.themeColorGreyPlaceholder};
        --color-theme-color-grey3 : ${colors.themeColorGrey3};
        --color-theme-color-alert : ${colors.themeColorAlert};
        --color-theme-background-light : ${colors.themeBackgroundLight};
        --color-theme-background : ${colors.themeBackground};
        --color-theme-color-primary-pure : ${colors.themeColorPrimaryPure};
        --color-theme-color-primary-dark : ${colors.themeColorPrimaryDark};
    }
  `);

export default colors;

export const antdThemes: Record<MenuTheme, ThemeConfig> = {
    dark: {
        token: {
            colorPrimary: colors.themeColorPrimaryPure,
            colorBgElevated: colors.themeColorGrey0,
            colorBgContainer: colors.themeColorGrey0,
            colorText: colors.neutralColorPurewhite,
            colorPrimaryBg: colors.themeColorPrimaryPure,
        },
        components: {
            Message: {
                contentBg: colors.neutralColorGrey7,
                colorBgBase: colors.themeColorGrey0,
            },
            Menu: {
                // colorBgLayout: colors.themeColorGrey0,
                // colorBgSolid: colors.themeColorGrey0,
                // colorBgBase: colors.themeColorGrey0,
                // colorBgContainer: colors.themeColorGrey0,
                // colorPrimaryBg: colors.themeColorGrey0,
                // darkItemBg: colors.themeColorGrey0,
                // darkPopupBg: colors.themeColorGrey0,
                // colorItemBgHover: colors.themeColorGrey0,
                // colorItemBgSelected: colors.themeColorGrey0,
                // colorItemTextSelected: colors.themeColorGrey0,
                // itemBg: colors.themeColorGrey0,
                // popupBg: colors.themeColorGrey0,
                // colorInfoBg: colors.themeColorGrey0,
                // colorBorderBg: colors.themeColorGrey0,
                // colorSubItemBg: colors.themeColorGrey0,
                // colorBgContainerDisabled: colors.themeColorGrey0,
                // colorBgSolidHover: colors.themeColorGrey0,
                // colorBgBlur: colors.themeColorGrey0,
                // colorBgElevated: colors.themeColorGrey0,
                // colorBgMask: colors.themeColorGrey0,
                // colorBgSolidActive: colors.themeColorGrey0,
                // colorBgSpotlight: colors.themeColorGrey0,
                // colorBgTextActive: colors.themeColorGrey0,
                // colorBgTextHover: colors.themeColorGrey0,
                // colorInfoBgHover: colors.themeColorGrey0,
                // itemHoverBg: colors.themeColorGrey0,
                // colorItemBg: colors.themeColorGrey0,
                // colorItemBgActive: colors.themeColorGrey0,
                // colorItemBgSelectedHorizontal: colors.themeColorGrey0,
                // colorErrorBg: colors.themeColorGrey0,
                // colorErrorBgActive: colors.themeColorGrey0,
                // colorErrorBgFilledHover: colors.themeColorGrey0,
                // colorErrorBgHover: colors.themeColorGrey0,
                // itemActiveBg: colors.themeColorGrey0,
                // controlItemBgActive: colors.themeColorGrey0,
                // controlItemBgActiveDisabled: colors.themeColorGrey0,
                // controlItemBgActiveHover: colors.themeColorGrey0,
                // colorSuccessBg: colors.themeColorGrey0,
                // colorSuccessBgHover: colors.themeColorGrey0,
                // colorWarningBg: colors.themeColorGrey0,
                // controlItemBgHover: colors.themeColorGrey0,
                // colorPrimaryBgHover: colors.themeColorGrey0,
                // subMenuItemBg: colors.themeColorGrey0,
                // darkSubMenuItemBg: colors.themeColorGrey0,
                // colorWarningBgHover: colors.themeColorGrey0,
                // itemSelectedBg: colors.themeColorGrey0,
                // darkItemHoverBg: colors.themeColorGrey0,
                // colorDangerItemBgActive: colors.themeColorGrey0,
                // colorDangerItemBgSelected: colors.themeColorGrey0,
                // dangerItemActiveBg: colors.themeColorGrey0,
                // darkItemSelectedBg: colors.themeColorGrey0,
                // dangerItemSelectedBg: colors.themeColorGrey0,
                // horizontalItemHoverBg: colors.themeColorGrey0,
                // darkDangerItemActiveBg: colors.themeColorGrey0,
                // darkDangerItemSelectedBg: colors.themeColorGrey0,
                // horizontalItemSelectedBg: colors.themeColorGrey0,
            },
            Layout: {
                bodyBg: colors.themeBackground,
                headerBg: colors.themeColorGrey0,
                siderBg: colors.themeColorGrey0,
            },
        },
    },
    light: {
        token: {
            colorPrimary: colors.themeColorPrimaryPure,
        },
        components: {
            Layout: {
                bodyBg: colors.neutralColorGrey1,
            },
        },
    },
};
