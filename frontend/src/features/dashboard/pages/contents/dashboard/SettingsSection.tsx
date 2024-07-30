import { AccountForm } from "./settings/form/account-form";
import { AppearanceForm } from "./settings/form/appearance-form";
import { DangerZoneForm } from "./settings/form/danger-zone-form";
import { DisplayForm } from "./settings/form/display-form";
import { NotificationsForm } from "./settings/form/notifications-form";

const SettingsSection = () => {
	return (
		<div className="space-y-20">
			<div id="account">
				<AccountForm />
			</div>
			<div id="appearance">
				<AppearanceForm />
			</div>
			<div id="display">
				<DisplayForm />
			</div>
			<div id="notifications">
				<NotificationsForm />
			</div>
			<div id="danger-zone">
				<DangerZoneForm />
			</div>
		</div>
	);
};

export default SettingsSection;
