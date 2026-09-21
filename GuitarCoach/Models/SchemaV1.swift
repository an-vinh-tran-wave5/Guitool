//
//  SchemaV1.swift
//  GuitarCoach
//
//  Wraps the MVP models in a VersionedSchema so Phase 2/3 additions (Song,
//  AmpProfile, AmpPreset) can arrive as SchemaV2/SchemaV3 with an explicit
//  MigrationPlan, instead of forcing a destructive migration later. There is
//  only one version today, so the migration plan has no stages yet.
//

import SwiftData

enum GuitarCoachSchemaV1: VersionedSchema {
    static var versionIdentifier = Schema.Version(1, 0, 0)

    static var models: [any PersistentModel.Type] {
        [Exercise.self, PracticeSession.self, SessionItem.self, UserSettings.self]
    }
}

enum GuitarCoachMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] {
        [GuitarCoachSchemaV1.self]
    }

    static var stages: [MigrationStage] {
        []
    }
}
