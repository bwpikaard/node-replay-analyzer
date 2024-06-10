import type {BoxcarsUpdatedActor} from "./boxcars-schemas";

export interface TAGame_GameEvent_TA_BotSkill extends BoxcarsUpdatedActor {
    object_name: "TAGame.GameEvent_TA:BotSkill";
    attribute: number;
}

export interface TAGame_Ball_TA_GameEvent extends BoxcarsUpdatedActor {
    object_name: "TAGame.Ball_TA:GameEvent";
    attribute: {
        active: boolean;
        actor: number;
    };
}

export interface Engine_PlayerReplicationInfo_PlayerName extends BoxcarsUpdatedActor {
    object_name: "Engine.PlayerReplicationInfo:PlayerName";
    attribute: string;
}

// TODO: ADD OTHER PLATFORMS
export interface Engine_PlayerReplicationInfo_UniqueId extends BoxcarsUpdatedActor {
    object_name: "Engine.PlayerReplicationInfo:UniqueId";
    attribute: {
        system_id: number;
        remote_id: {Steam: string} | {Epic: string};
        local_id: number;
    };
}

export interface Engine_PlayerReplicationInfo_Ping extends BoxcarsUpdatedActor {
    object_name: "Engine.PlayerReplicationInfo:Ping";
    attribute: number;
}

export interface Engine_PlayerReplicationInfo_Team extends BoxcarsUpdatedActor {
    object_name: "Engine.PlayerReplicationInfo:Team";
    attribute: {
        active: boolean;
        actor: number;
    };
}

export interface Engine_TeamInfo_Score extends BoxcarsUpdatedActor {
    object_name: "Engine.TeamInfo:Score";
    attribute: number;
}

export interface TAGame_Team_TA_ClubColors extends BoxcarsUpdatedActor {
    object_name: "TAGame.Team_TA:ClubColors";
    attribute: {
        blue_flag: boolean;
        blue_color: number;
        orange_flag: boolean;
        orange_color: number;
    };
}

export interface TAGame_Team_TA_CustomTeamName extends BoxcarsUpdatedActor {
    object_name: "TAGame.Team_TA:CustomTeamName";
    attribute: string;
}

export interface Engine_Pawn_PlayerReplicationInfo extends BoxcarsUpdatedActor {
    object_name: "Engine.Pawn:PlayerReplicationInfo";
    attribute: {
        active: boolean;
        actor: number;
    };
}

export interface TAGame_Car_TA_ReplicatedDemolish extends BoxcarsUpdatedActor {
    object_name: "TAGame.Car_TA:ReplicatedDemolish";
    attribute: {
        custom_demo_flag: boolean;
        custom_demo_id: number;
        attacker_flag: boolean;
        attacker: number;
        victim_flag: boolean;
        victim: number;
        attack_velocity: {
            x: number;
            y: number;
            z: number;
        };
        victim_velocity: {
            x: number;
            y: number;
            z: number;
        };
    };
}

export interface TAGame_Car_TA_ReplicatedDemolishGoalExplosion extends BoxcarsUpdatedActor {
    object_name: "TAGame.Car_TA:ReplicatedDemolishGoalExplosion";
    attribute: {
        custom_demo_flag: boolean;
        custom_demo_id: number;
        attacker_flag: boolean;
        attacker: number;
        victim_flag: boolean;
        victim: number;
        attack_velocity: {
            x: number;
            y: number;
            z: number;
        };
        victim_velocity: {
            x: number;
            y: number;
            z: number;
        };
    };
}

export interface TAGame_RBActor_TA_ReplicatedRBState extends BoxcarsUpdatedActor {
    object_name: "TAGame.RBActor_TA:ReplicatedRBState";
    attribute: {
        sleeping: false;
        location: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        linear_velocity: {
            x: number;
            y: number;
            z: number;
        };
        angular_velocity: {
            x: number;
            y: number;
            z: number;
        };
    };
}

export interface TAGame_Vehicle_TA_ReplicatedThrottle extends BoxcarsUpdatedActor {
    object_name: "TAGame.Vehicle_TA:ReplicatedThrottle";
    attribute: number;
}

export interface TAGame_Vehicle_TA_ReplicatedSteer extends BoxcarsUpdatedActor {
    object_name: "TAGame.Vehicle_TA:ReplicatedSteer";
    attribute: number;
}

export interface TAGame_Vehicle_TA_bReplicatedHandbrake extends BoxcarsUpdatedActor {
    object_name: "TAGame.Vehicle_TA:bReplicatedHandbrake";
    attribute: boolean;
}

export interface TAGame_Vehicle_TA_bDriving extends BoxcarsUpdatedActor {
    object_name: "TAGame.Vehicle_TA:bDriving";
    attribute: boolean;
}

export interface TAGame_PRI_TA_MatchScore extends BoxcarsUpdatedActor {
    object_name: "TAGame.PRI_TA:MatchScore";
    attribute: number;
}

export interface TAGame_PRI_TA_MatchGoals extends BoxcarsUpdatedActor {
    object_name: "TAGame.PRI_TA:MatchGoals";
    attribute: number;
}

export interface TAGame_PRI_TA_MatchShots extends BoxcarsUpdatedActor {
    object_name: "TAGame.PRI_TA:MatchShots";
    attribute: number;
}

export interface TAGame_PRI_TA_MatchAssists extends BoxcarsUpdatedActor {
    object_name: "TAGame.PRI_TA:MatchAssists";
    attribute: number;
}

export interface TAGame_PRI_TA_MatchSaves extends BoxcarsUpdatedActor {
    object_name: "TAGame.PRI_TA:MatchSaves";
    attribute: number;
}

export interface Engine_GameReplicationInfo_ServerName extends BoxcarsUpdatedActor {
    object_name: "Engine.GameReplicationInfo:ServerName";
    attribute: string;
}

export interface ProjectX_GRI_X_MatchGuid extends BoxcarsUpdatedActor {
    object_name: "ProjectX.GRI_X:MatchGuid";
    attribute: string;
}

export interface ProjectX_GRI_X_GameServerID extends BoxcarsUpdatedActor {
    object_name: "ProjectX.GRI_X:GameServerID";
    attribute: string;
}

export interface ProjectX_GRI_X_ReplicatedServerRegion extends BoxcarsUpdatedActor {
    object_name: "ProjectX.GRI_X:ReplicatedServerRegion";
    attribute: string;
}

export interface ProjectX_GRI_X_ReplicatedGamePlaylist extends BoxcarsUpdatedActor {
    object_name: "ProjectX.GRI_X:ReplicatedGamePlaylist";
    attribute: string;
}

export interface TAGame_GameEvent_Soccar_TA_SecondsRemaining extends BoxcarsUpdatedActor {
    object_name: "TAGame.GameEvent_Soccar_TA:SecondsRemaining";
    attribute: number;
}

export interface TAGame_GameEvent_TA_ReplicatedRoundCountDownNumber extends BoxcarsUpdatedActor {
    object_name: "TAGame.GameEvent_TA:ReplicatedRoundCountDownNumber";
    attribute: number;
}

export interface TAGame_PRI_TA_PartyLeader extends BoxcarsUpdatedActor {
    object_name: "TAGame.PRI_TA:PartyLeader";
    attribute: {
        system_id: number;
        remote_id: {Steam: string} | {Epic: string};
        local_id: number;
    };
}

export interface TAGame_Team_TA_ClubID extends BoxcarsUpdatedActor {
    object_name: "TAGame.Team_TA:ClubID";
    attribute: string;
}

export interface TAGame_CameraSettingsActor_TA_PRI extends BoxcarsUpdatedActor {
    object_name: "TAGame.CameraSettingsActor_TA:PRI";
    attribute: {
        active: boolean;
        actor: number;
    };
}

export interface TAGame_CameraSettingsActor_TA_ProfileSettings extends BoxcarsUpdatedActor {
    object_name: "TAGame.CameraSettingsActor_TA:ProfileSettings";
    attribute: {
        fov: number;
        height: number;
        angle: number;
        distance: number;
        stiffness: number;
        swivel: number;
        transition: number;
    };
}

export type UpdatedActor =
    | TAGame_GameEvent_TA_BotSkill
    | TAGame_Ball_TA_GameEvent
    | Engine_PlayerReplicationInfo_PlayerName
    | Engine_PlayerReplicationInfo_UniqueId
    | Engine_PlayerReplicationInfo_Ping
    | Engine_PlayerReplicationInfo_Team
    | Engine_TeamInfo_Score
    | TAGame_Team_TA_ClubColors
    | TAGame_Team_TA_CustomTeamName
    | Engine_Pawn_PlayerReplicationInfo
    | TAGame_Car_TA_ReplicatedDemolish
    | TAGame_Car_TA_ReplicatedDemolishGoalExplosion
    | TAGame_RBActor_TA_ReplicatedRBState
    | TAGame_Vehicle_TA_ReplicatedThrottle
    | TAGame_Vehicle_TA_ReplicatedSteer
    | TAGame_Vehicle_TA_bReplicatedHandbrake
    | TAGame_Vehicle_TA_bDriving
    | TAGame_PRI_TA_MatchScore
    | TAGame_PRI_TA_MatchGoals
    | TAGame_PRI_TA_MatchShots
    | TAGame_PRI_TA_MatchAssists
    | TAGame_PRI_TA_MatchSaves
    | Engine_GameReplicationInfo_ServerName
    | ProjectX_GRI_X_MatchGuid
    | ProjectX_GRI_X_GameServerID
    | ProjectX_GRI_X_ReplicatedServerRegion
    | ProjectX_GRI_X_ReplicatedGamePlaylist
    | TAGame_GameEvent_Soccar_TA_SecondsRemaining
    | TAGame_GameEvent_TA_ReplicatedRoundCountDownNumber
    | TAGame_PRI_TA_PartyLeader
    | TAGame_Team_TA_ClubID
    | TAGame_CameraSettingsActor_TA_PRI
    | TAGame_CameraSettingsActor_TA_ProfileSettings;

export type ActorObject<T extends UpdatedActor = UpdatedActor> = T["object_name"];
export type ActorAttribute<T extends UpdatedActor = UpdatedActor> = T["attribute"];
