//
//  Exercise.swift
//  GuitarCoach
//
//  Core exercise entity. Seeded from Resources/seed_exercises.json on first
//  launch (see ExerciseSeeder) and editable by the user afterward.
//

import Foundation
import SwiftData

/// The four MVP exercise categories. `song` is reserved for Phase 2 (Song
/// Practice entries) and is intentionally not seeded or shown yet.
enum ExerciseCategory: String, Codable, CaseIterable, Identifiable {
    case technique
    case scale
    case rhythm
    case knowledge
    case song

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .technique: return "Technique"
        case .scale: return "Scales"
        case .rhythm: return "Rhythm"
        case .knowledge: return "Guitar Knowledge"
        case .song: return "Song Practice"
        }
    }

    var symbolName: String {
        switch self {
        case .technique: return "hand.draw"
        case .scale: return "music.note.list"
        case .rhythm: return "metronome"
        case .knowledge: return "brain.head.profile"
        case .song: return "guitars"
        }
    }
}

@Model
final class Exercise {
    /// Stable identity independent of SwiftData's own persistent identifier,
    /// so seed data and `SessionItem` references stay simple to reason about.
    var id: UUID

    var name: String
    var categoryRaw: String
    var descriptionText: String

    /// 1 (trivial) ... 5 (very hard). Fixed per exercise, editable by the user.
    var difficulty: Int
    /// 1 (nice to have) ... 5 (core skill). Fixed per exercise, editable by the user.
    var importance: Int
    /// 1 (struggling) ... 5 (confident). User-rated; nudged upward automatically
    /// when currentBPM approaches targetBPM.
    var proficiency: Int

    /// Tempo fields are optional because a handful of exercises (fretboard
    /// knowledge, ear training) aren't tempo-based at all.
    var recommendedBPM: Int?
    var targetBPM: Int?
    var currentBPM: Int?

    /// User override multiplier applied on top of the computed score.
    /// 1.0 = no adjustment. Range is enforced in the UI (0.5...1.5).
    var priority: Double

    var lastPracticedAt: Date?
    var timesPracticed: Int
    var notes: String

    /// False for everything shipped in Resources/seed_exercises.json.
    var isCustom: Bool
    /// Archived exercises are excluded from the allocation engine and from
    /// the library's default list, but their history is kept.
    var isArchived: Bool

    @Relationship(deleteRule: .cascade, inverse: \SessionItem.exercise)
    var sessionItems: [SessionItem] = []

    var category: ExerciseCategory {
        get { ExerciseCategory(rawValue: categoryRaw) ?? .technique }
        set { categoryRaw = newValue.rawValue }
    }

    init(
        id: UUID = UUID(),
        name: String,
        category: ExerciseCategory,
        descriptionText: String,
        difficulty: Int,
        importance: Int,
        proficiency: Int = 3,
        recommendedBPM: Int? = nil,
        targetBPM: Int? = nil,
        currentBPM: Int? = nil,
        priority: Double = 1.0,
        lastPracticedAt: Date? = nil,
        timesPracticed: Int = 0,
        notes: String = "",
        isCustom: Bool = false,
        isArchived: Bool = false
    ) {
        self.id = id
        self.name = name
        self.categoryRaw = category.rawValue
        self.descriptionText = descriptionText
        self.difficulty = difficulty
        self.importance = importance
        self.proficiency = proficiency
        self.recommendedBPM = recommendedBPM
        self.targetBPM = targetBPM
        self.currentBPM = currentBPM
        self.priority = priority
        self.lastPracticedAt = lastPracticedAt
        self.timesPracticed = timesPracticed
        self.notes = notes
        self.isCustom = isCustom
        self.isArchived = isArchived
    }

    /// Days since this exercise was last practiced, as of `referenceDate`.
    /// `nil` means "never practiced" and is treated by the allocation engine
    /// as maximally overdue.
    func daysSincePracticed(asOf referenceDate: Date = .now, calendar: Calendar = .current) -> Int? {
        guard let lastPracticedAt else { return nil }
        let start = calendar.startOfDay(for: lastPracticedAt)
        let end = calendar.startOfDay(for: referenceDate)
        return calendar.dateComponents([.day], from: start, to: end).day
    }
}
