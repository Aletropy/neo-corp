import { Server } from "socket.io";
import Character, { CharacterAttributes } from "../Data/Models/Character";
import { EvaluationResult } from "../Dice/DiceInterpreter";

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

export default class SessionHandler 
{
    private static io : Server;
    private static campaignPlayers : any = {};
    private static socketToUser : any = {};

    public static initialize(io : Server)
    {
        this.io = io;
        this.io.on('connection', (socket) => {

            socket.on('joinSession', (data : JoinSessionData) => {
                const { campaignId, character, user } = data;

                if (!this.campaignPlayers[campaignId]) {
                    this.campaignPlayers[campaignId] = {};
                }

                this.socketToUser[socket.id] = user;
                this.campaignPlayers[campaignId][user.id] = character;

                socket.join(campaignId);
                socket.emit('updatePlayerList', this.campaignPlayers[campaignId]);
                socket.broadcast.emit('updatePlayerList', this.campaignPlayers[campaignId]);
            })

            socket.on('disconnect', () => {
                const user = this.socketToUser[socket.id];
                if (user) {
                    for (const campaignId in this.campaignPlayers) {
                        if (this.campaignPlayers[campaignId][user.id]) {
                            delete this.campaignPlayers[campaignId][user.id];
                            socket.to(campaignId).emit('updatePlayerList', this.campaignPlayers[campaignId]);
                        }
                    }
                    delete this.socketToUser[socket.id];
                }
            });
        });
    }

    public static PropagateRoll(_: { id: number; username: string; isAdmin: boolean; }, char: Character, roll: EvaluationResult)
    {
        this.io.emit("newDiceRoll", {
            rollerName: (char.get("info") as any).name,
            rollDetails: roll.stringValue,
            total: roll.value
        });
    }
}