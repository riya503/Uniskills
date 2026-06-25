const { User } = require('../models');
const { db } = require('../config/firebase');
const { Op } = require('sequelize');

const getChatId = (id1, id2) => {
    return [id1.toString(), id2.toString()].sort().join('_');
};

exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const chatId = getChatId(senderId, receiverId);

                const messageData = {
            senderId: senderId.toString(),
            receiverId: receiverId.toString(),
            content,
            read: false,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('chats').doc(chatId).collection('messages').add(messageData);

        await db.collection('chats').doc(chatId).set({
            lastMessage: content,
            lastMessageTime: messageData.createdAt,
            participants: [senderId.toString(), receiverId.toString()]
        }, { merge: true });

        const populatedMessage = { id: docRef.id, ...messageData };

        req.app.get('socketio').emit(`chat_${receiverId}`, populatedMessage);
        res.status(201).json(populatedMessage);
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const chatId = getChatId(user1Id, user2Id);

                const snapshot = await db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc').get();
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                res.status(200).json(messages);
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
};

exports.getChatContacts = async (req, res) => {
    try {
         const { userId } = req.params;
         const contacts = await User.findAll({
             where: { id: { [Op.ne]: userId } },
             attributes: ['id', 'name', 'profilePic']
         });

                  const contactsWithMeta = await Promise.all(contacts.map(async (contact) => {
             const raw = contact.toJSON();
             const chatId = getChatId(userId, raw.id);

             const chatDoc = await db.collection('chats').doc(chatId).get();
             if (chatDoc.exists) {
                 const data = chatDoc.data();
                 raw.lastMessage = data.lastMessage;
                 raw.lastMessageTime = data.lastMessageTime;
             } else {
                 raw.lastMessage = null;
                 raw.lastMessageTime = null;
             }

             const unreadSnapshot = await db.collection('chats').doc(chatId).collection('messages')
                 .where('receiverId', '==', userId.toString())
                 .where('senderId', '==', raw.id.toString())
                 .where('read', '==', false)
                 .get();

                              raw.unreadCount = unreadSnapshot.size;
             return raw;
         }));

                  contactsWithMeta.sort((a, b) => {
             if (!a.lastMessageTime) return 1;
             if (!b.lastMessageTime) return -1;
             return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
         });

                  res.status(200).json(contactsWithMeta);
    } catch(err) {
         console.error(err);
         res.status(500).json({ error: err.message });
    }
};

exports.markMessagesAsSeen = async (req, res) => {
    try {
        const { myUserId, chatPartnerId } = req.body;
        const chatId = getChatId(myUserId, chatPartnerId);

                const unreadSnapshot = await db.collection('chats').doc(chatId).collection('messages')
            .where('receiverId', '==', myUserId.toString())
            .where('senderId', '==', chatPartnerId.toString())
            .where('read', '==', false)
            .get();

                    const batch = db.batch();
        unreadSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });
        await batch.commit();

                req.app.get('socketio').emit(`chat_seen_${chatPartnerId}`, { viewerId: myUserId });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
