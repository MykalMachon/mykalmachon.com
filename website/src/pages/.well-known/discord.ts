export const GET = async () => {
	return new Response(`dh=17b4b147f07972d1a283c5ee20e9f66dd0f8c69d`, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	})
}
