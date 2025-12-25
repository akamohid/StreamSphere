const express = require("express");
const mongoose = require("mongoose");
const Subscribe = require("../Model/Subscribe");

const router = express.Router();


//Get all subscriber of the user
//URL http://localhost:5000/subscription/
router.get("/:id", async (req, res) => {
    try {
        const user_id = req.params.id;
        const subscriptions = await Subscribe.findOne({ user_id });
        return res.status(200).send(subscriptions);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error });
    }
})



//Subscribe Channel
//URL http://localhost:5000/subscription/subscribe
router.post("/subscribe", async (req, res) => {
    try {
        const { user_id, subscribedChannel } = req.body;

        if (!user_id || !subscribedChannel || !subscribedChannel[0]) {
            return res.status(400).send({ message: "Invalid request body" });
        }

        const isPresent = await Subscribe.findOne({ user_id });

        if (isPresent) {
            const channelId = subscribedChannel[0];

            const alreadySubscribed = isPresent.subscribedChannel.some(
                (channel) => channel.toString() === channelId
            );

            if (alreadySubscribed) {
                return res.status(200).send({ message: "Already subscribed" });
            }

            isPresent.subscribedChannel.push(channelId);
            await isPresent.save();
            return res.status(200).send({ message: "Subscribed successfully" });
        }

        const subscribe = new Subscribe({ user_id, subscribedChannel });
        await subscribe.save();
        return res.status(200).send({ message: "Subscribed successfully" });

    } catch (err) {
        console.error(err);
        return res.status(400).send({ message: "Error while subscribing" });
    }
});


//Number of subscribers
//URL http://localhost:5000/subscription/count/id         here the id is user_id

router.get('/count/:id', async (req, res) => {
    try {
        const channelId = req.params.id;
        // Find all subscriptions where subscribedChannel array includes channelId
        const subs = await Subscribe.find({ subscribedChannel: channelId });
        return res.status(200).json({ count: subs.length });
    } catch (err) {
        console.error('Error fetching subscription count', err);
        return res.status(500).json({ error: 'Error fetching subscription count' });
    }
});


//UN-Subscribe Channel
//URL http://localhost:5000/subscription/unsubscribe/id         here the id is other person(whom you want to unsubscribe)
router.put("/unsubscribe/:id", async (req, res) => {
    try {
        const channelIdToUnsubscribe = req.params.id;
        const userId = req.body.user_id;
        if (!channelIdToUnsubscribe) {
            return res.status(400).send({ error: "Incorrect Channel ID" });
        }
        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }
        const subscription = await Subscribe.findOne({ user_id: userId });
        if (!subscription) {
            return res.status(404).send({ error: "Subscription not found" });
        }
        subscription.subscribedChannel = subscription.subscribedChannel.filter(
            (id) => id.toString() !== channelIdToUnsubscribe
        );
        await subscription.save();
        return res.status(200).send({ message: "Unsubscribed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ message: "Error while unsubscribing" });
    }
});


module.exports = router;