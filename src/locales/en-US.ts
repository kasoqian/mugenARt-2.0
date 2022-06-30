import { enEventsTabs } from './components/events/tabs';
import { enJoinUs } from './components/home/joinUs';
import { enBindEmail } from './components/dialog/bindEmail';
import { enHashPalette } from './components/dialog/hashpalette';
import { enLoggedIn } from './components/dialog/LoggedIn';
import { enResetPassWord } from './components/dialog/resetPassword';
import { enSignIn } from './components/dialog/signIn';
import { enSignChoose } from './components/dialog/signChoose';
import { enSignUp } from './components/dialog/signUp';
import { enMessage } from './components/message';
import { enUserSetting } from './components/user/setting';
import { enUserBar } from './components/user/bar';
import { enAbout } from './components/home/about';
import { enCountDown } from './components/home/countDown';
import { enBoxIntro as enHomeBoxIntro } from './components/home/boxIntro';
import { enAssetDetail } from './components/asset';
import { enPartners } from './components/home/partners';
import { enHomeMenu } from './components/home/menu';
import { enHomeFooter } from './components/home/footer';
import { enBoxBuy } from './components/mugenBox/buy';
import { enBoxIntro } from './components/mugenBox/intro';
import { enUserShare } from './components/user/share';
import { enVerifyInput } from './components/components/verifyInput';
import { enEventsEarn } from './components/events/earn';
import { enEventsActivities } from './components/events/activities';
import { enEventsPay } from './components/events/pay';

export default {
  ...enBindEmail,
  ...enHashPalette,
  ...enLoggedIn,
  ...enResetPassWord,
  ...enSignIn,
  ...enSignChoose,
  ...enSignUp,
  ...enMessage,
  ...enUserSetting,
  ...enUserBar,
  ...enAbout,
  ...enJoinUs,
  ...enCountDown,
  ...enAssetDetail,
  ...enPartners,
  ...enHomeMenu,
  ...enHomeBoxIntro,
  ...enHomeFooter,
  ...enBoxBuy,
  ...enBoxIntro,
  ...enUserShare,
  ...enVerifyInput,
  ...enEventsTabs,
  ...enEventsEarn,
  ...enEventsActivities,
  ...enEventsPay,
};
