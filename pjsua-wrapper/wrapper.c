#include <pjsua.h>

typedef void(*my_callback)(int);

static pjsua_acc_id acc_id;
static pjsua_call_id call_id;
static pj_status_t status;
static my_callback callback = NULL;

static void on_call_state(pjsua_call_id cid, pjsip_event *e) {
	pjsua_call_info ci;
	int ret = 0;

	pjsua_call_get_info(cid, &ci);

	switch (ci.state) {
		case PJSIP_INV_STATE_NULL:
			ret = 0;
			break;
		case PJSIP_INV_STATE_CALLING:
			ret = 1;
			break;
		case PJSIP_INV_STATE_INCOMING:
			ret = 2;
			break;
		case PJSIP_INV_STATE_EARLY:
			ret = 3;
			break;
		case PJSIP_INV_STATE_CONNECTING:
			ret = 4;
			break;
		case PJSIP_INV_STATE_CONFIRMED:
			ret = 5;
			break;
		case PJSIP_INV_STATE_DISCONNECTED:
			ret = 6;
			break;
	}
	if (callback != NULL)
		callback(ret);
}

static void on_incoming_call(pjsua_acc_id aid, pjsua_call_id cid, pjsip_rx_data *rdata) {
	pjsua_call_info ci;

	PJ_UNUSED_ARG(aid);
	PJ_UNUSED_ARG(rdata);

	pjsua_call_get_info(cid, &ci);

	pjsua_call_answer(cid, 200, NULL, NULL);
}

static void on_call_media_state(pjsua_call_id cid) {
	pjsua_call_info ci;

	pjsua_call_get_info(cid, &ci);

	if (ci.media_status == PJSUA_CALL_MEDIA_ACTIVE) {
		pjsua_conf_connect(ci.conf_slot, 0);
		pjsua_conf_connect(0, ci.conf_slot);
	}
}

__declspec(dllexport) int __cdecl init() {
	status = pjsua_create();
	if (status != PJ_SUCCESS) return status;

	{
		pjsua_config cfg;
		pjsua_config_default(&cfg);
		cfg.cb.on_incoming_call = &on_incoming_call;
		cfg.cb.on_call_media_state = &on_call_media_state;
		cfg.cb.on_call_state = &on_call_state;

		status = pjsua_init(&cfg, NULL, NULL);
		if (status != PJ_SUCCESS) return status;
	}
	
	pjsua_transport_id transport_id = -1;
	{
		pjsua_transport_config cfg;
		pjsua_transport_config_default(&cfg);
		status = pjsua_transport_create(PJSIP_TRANSPORT_UDP, &cfg, &transport_id);
		if (status != PJ_SUCCESS) return status;
	}

	pjsua_acc_add_local(transport_id, PJ_TRUE, &acc_id);

	status = pjsua_start();
	if (status != PJ_SUCCESS) return status;

	return 0;
}

__declspec(dllexport) void __cdecl destroy() {
	pjsua_destroy();
}

__declspec(dllexport) int __cdecl call(char *target) {
	pj_str_t uri = pj_str(target);
	status = pjsua_call_make_call(acc_id, &uri, 0, NULL, NULL, &call_id);
	return status;
}

__declspec(dllexport) int __cdecl dtmf(char *str) {
	pj_str_t digits = pj_str(str);
	status = pjsua_call_dial_dtmf(call_id, &digits);
	if (status != PJ_SUCCESS) return status;
	return 0;
}

__declspec(dllexport) int __cdecl setStateChangedCallback(my_callback cb) {
	callback = cb;
}
