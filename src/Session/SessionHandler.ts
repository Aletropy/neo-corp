import { Server } from "socket.io";
import { CharacterAttributes } from "../Data/Models/Character";

interface JoinSessionData
{
    campaignId: string;
    character : CharacterAttributes;
    user : {
        id: string;
        username: string;
        isAdmin: boolean;
    }
}

export default (io : Server) => {

    const campaignPlayers : any = {};
    const socketToUser : any = {};

    io.on('connection', (socket) => {

        socket.on('joinSession', (data : JoinSessionData) => {
            const { campaignId, character, user } = data;

            if (!campaignPlayers[campaignId]) {
                campaignPlayers[campaignId] = {};
            }

            socketToUser[socket.id] = user;
            campaignPlayers[campaignId][user.id] = character;

            socket.join(campaignId);
            socket.emit('updatePlayerList', campaignPlayers[campaignId]);
            socket.broadcast.emit('updatePlayerList', campaignPlayers[campaignId]);
        })

        socket.on('disconnect', () => {
            const user = socketToUser[socket.id];
            if (user) {
                for (const campaignId in campaignPlayers) {
                    if (campaignPlayers[campaignId][user.id]) {
                        delete campaignPlayers[campaignId][user.id];
                        socket.to(campaignId).emit('updatePlayerList', campaignPlayers[campaignId]);
                    }
                }
                delete socketToUser[socket.id];
            }
        });
    });
}