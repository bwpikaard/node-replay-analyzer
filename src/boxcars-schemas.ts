import {z} from "zod";

const PropertiesGoalSchema = z.object({
    PlayerName: z.string(),
    PlayerTeam: z.number(),
    frame: z.number(),
});

const PropertiesHighlightsSchema = z.object({
    BallName: z.string(),
    frame: z.number(),
    GoalActorName: z.string(),
    CarName: z.string(),
});

const PropertiesPlayerStatsPlatformSchema = z.object({
    kind: z.string(),
    value: z.string(),
});

const PropertiesPlayerStatsSchema = z.object({
    OnlineID: z.string(),
    Name: z.string(),
    Assists: z.number(),
    Saves: z.number(),
    bBot: z.boolean(),
    Shots: z.number(),
    Team: z.number(),
    Platform: PropertiesPlayerStatsPlatformSchema,
    Score: z.number(),
    Goals: z.number(),
});

const PropertiesSchema = z
    .object({
        TeamSize: z.number(),
        UnfairTeamSize: z.number(),
        PrimaryPlayerTeam: z.number().optional(),
        Team0Score: z.number().optional(),
        Team1Score: z.number().optional(),
        Goals: PropertiesGoalSchema.array(),
        HighLights: PropertiesHighlightsSchema.array(),
        PlayerStats: PropertiesPlayerStatsSchema.array(),
        ReplayVersion: z.number(),
        ReplayLastSaveVersion: z.number(),
        GameVersion: z.number(),
        BuildID: z.number(),
        Changelist: z.number(),
        BuildVersion: z.string(),
        ReserveMegabytes: z.number(),
        RecordFPS: z.number(),
        KeyframeDelay: z.number(),
        MaxChannels: z.number(),
        MaxReplaySizeMB: z.number(),
        Id: z.string(),
        MapName: z.string(),
        Date: z.string(),
        NumFrames: z.number(),
        MatchType: z.string(),
        ReplayName: z.string().optional(),
        PlayerName: z.string().optional(),
    })
    .strict();

const NewActorSchema = z.object({
    actor_id: z.number(),
    name_id: z.number(),
    object_id: z.number(),
    initial_trajectory: z.object({
        location: z
            .object({
                x: z.number(),
                y: z.number(),
                z: z.number(),
            })
            .nullable(),
        rotation: z
            .object({
                yaw: z.number().nullable(),
                pitch: z.number().nullable(),
                roll: z.number().nullable(),
            })
            .nullable(),
    }),
});

export type BoxcarsNewActor = z.infer<typeof NewActorSchema>;

const UpdatedActorSchema = z.object({
    actor_id: z.number(),
    stream_id: z.number(),
    object_id: z.number(),
    object_name: z.string().optional(),
    attribute: z.unknown(),
});

export type BoxcarsUpdatedActor = z.infer<typeof UpdatedActorSchema>;

const DeletedActorSchema = z.number();

const NetworkFrameSchema = z.object({
    time: z.number(),
    delta: z.number(),
    new_actors: NewActorSchema.strip().array(),
    deleted_actors: DeletedActorSchema.array(),
    updated_actors: UpdatedActorSchema.array(),
});

const NetworkFramesSchema = z.object({
    frames: z.array(NetworkFrameSchema),
});

const KeyframeSchema = z.object({
    time: z.number(),
    frame: z.number(),
    position: z.number(),
});

const DebugInfoSchema = z.object({
    frame: z.number(),
    user: z.string(),
    text: z.string(),
});

const TickMarkSchema = z.object({
    description: z.string(),
    frame: z.number(),
});

const ClassIndex = z.object({
    class: z.string(),
    index: z.number(),
});

const NetCacheProperty = z.object({
    object_ind: z.number(),
    stream_id: z.number(),
});

const NetCache = z.object({
    object_ind: z.number(),
    parent_id: z.number(),
    cache_id: z.number(),
    properties: NetCacheProperty.array(),
});

export const BoxcarsReplaySchema = z
    .object({
        header_size: z.number(),
        header_crc: z.number(),
        major_version: z.number(),
        minor_version: z.number(),
        net_version: z.number(),
        game_type: z.string(),
        properties: PropertiesSchema,
        content_size: z.number(),
        content_crc: z.number(),
        network_frames: NetworkFramesSchema,
        levels: z.string().array(),
        keyframes: KeyframeSchema.array(),
        debug_info: DebugInfoSchema.array(),
        tick_marks: TickMarkSchema.array(),
        packages: z.string().array(),
        objects: z.string().array(),
        names: z.string().array(),
        class_indices: ClassIndex.array(),
        net_cache: NetCache.array(),
    })
    .strict();

export type BoxcarsReplay = z.infer<typeof BoxcarsReplaySchema>;
