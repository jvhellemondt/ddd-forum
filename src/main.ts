import "~/shared/infrastructure/database";

import app from "~/shared/infrastructure/api";
export default {
	port: 3000,
	fetch: app.fetch,
};
