import { Request, Response } from 'express';
import { Expo } from 'expo-server-sdk';

const sendMessage = async (req: Request, res: Response) => {

    const { ...data } = req.body

    try {
        let expo = new Expo({ accessToken: 'DTkss6v_Z9qdGvEZLwI2D0_eTs5h-M4XF6Wx5leW' });
        let messages = [];

        const pushToken = data.token

        if (!data.toke) {
            return res.status(200).send({
                ok: false,
                messages: "Token not available"
            })
        }

        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
        }
        if (data.state == 2) {
            messages.push(
                {
                    to: pushToken,
                    title: "Coopharma my shop! 📬",
                    subtitle: 'purchase order process',
                    sound: 'default',
                    body: 'Your order is being prepared',
                    badge: 0,
                    data: { data: 'goes here' },
                }
            )
        }
        if (data.state == 3) {
            messages.push(
                {
                    to: pushToken,
                    title: "Coopharma my shop! 📬",
                    subtitle: 'purchase order process',
                    sound: 'default',
                    body: 'Order is ready to be picked up, notification to carriers has been sent',
                    badge: 0,
                    data: { data: 'goes here' },
                }
            )
        }
        if (data.state == 4) {
            messages.push(
                {
                    to: pushToken,
                    title: "Coopharma my shop! 📬",
                    sound: 'default',
                    body: 'Added a new order',
                    badge: 0,
                    data: { data: 'goes here' },
                }
            )
        }

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            tickets.push(...ticketChunk);
        }

        res.status(200).send({
            ok: true,
            pushToken,
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        })
    }
}

export {
    sendMessage
}