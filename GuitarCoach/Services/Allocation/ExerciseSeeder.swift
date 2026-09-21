//
//  ExerciseSeeder.swift
//  GuitarCoach
//
//  Loads Resources/seed_exercises.json into SwiftData the first time the app
//  launches. Safe to call on every launch: it no-ops once any Exercise
//  already exists, so it never duplicates or overwrites user edits.
//

import Foundation
import SwiftData

private struct SeedExercise: Decodable {
    let name: String
    let category: String
    let description: String
    let difficulty: Int
    let importance: Int
    let recommendedBPM: Int?
}

enum ExerciseSeeder {
    enum SeedError: Error {
        case resourceMissing
    }

    @MainActor
    static func seedIfNeeded(context: ModelContext) {
        let existingCount = try? context.fetchCount(FetchDescriptor<Exercise>())
        guard (existingCount ?? 0) == 0 else { return }

        do {
            let seeds = try loadSeeds()
            for seed in seeds {
                guard let category = ExerciseCategory(rawValue: seed.category) else { continue }
                let exercise = Exercise(
                    name: seed.name,
                    category: category,
                    descriptionText: seed.description,
                    difficulty: seed.difficulty,
                    importance: seed.importance,
                    proficiency: 3,
                    recommendedBPM: seed.recommendedBPM,
                    targetBPM: seed.recommendedBPM,
                    currentBPM: seed.recommendedBPM.map { max(40, Int((Double($0) * 0.7).rounded())) }
                )
                context.insert(exercise)
            }
            try context.save()
        } catch {
            // Seeding is best-effort: a missing/corrupt bundle resource
            // should never crash launch. The Exercise Library simply opens
            // empty and the user can add custom exercises once that ships.
            print("ExerciseSeeder: failed to seed built-in exercises: \(error)")
        }
    }

    private static func loadSeeds() throws -> [SeedExercise] {
        guard let url = Bundle.main.url(forResource: "seed_exercises", withExtension: "json") else {
            throw SeedError.resourceMissing
        }
        let data = try Data(contentsOf: url)
        return try JSONDecoder().decode([SeedExercise].self, from: data)
    }
}
