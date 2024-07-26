self.addEventListener("install", function (event) {
    console.log("sw.js mounted");
	self.skipWaiting();
});

self.addEventListener('push', function(event) {
	console.log('Push received');
    
	let title = 'Notification';
	const options = {
		body: 'Notif body.',
		icon: './images/logo-192x192.png',
		badge: './images/badge-72x72.png',
		data: {
			url: 'http://localhost:3000/',
		},
	};

	if (event.data) {
		const dataText = event.data.text();
		const data = JSON.parse(dataText);

        switch (event.data.type) {
            case 'variant1':
                title = "Notification Type 1!"
                options.body = data?.body;
				options.data.url = `http://localhost:3000/${data?.visitId}`
            default:
                title = "Notification Type 2!"
                options.body = data?.body;
				options.data.url = `http://localhost:3000/${data?.visitId}`
        }
	}

	event.waitUntil(
		self.registration.showNotification(
			title,
			options,
		),
	);
});

self.addEventListener('notificationclick', function(event) {
	console.log('Notification clicked.');
	event.notification.close();

	let clickResponsePromise = Promise.resolve();
	if (event.notification.data && event.notification.data.url) {
		clickResponsePromise = clients.openWindow(event.notification.data.url);
	}

	event.waitUntil(clickResponsePromise);
});