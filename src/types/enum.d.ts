enum OptType {
  Nomal = 0,
  Mute = 1,
  WithoutNotify = 2,
}

enum AllowType {
  Allowed,
  NotAllowed,
}

enum GroupType {
  NomalGroup,
  SuperGroup,
  WorkingGroup,
}

enum GroupJoinSource {
  Invitation = 2,
  Search = 3,
  QrCode = 4,
}

enum GroupRole {
  Nomal = 1,
  Owner = 2,
  Admin = 3,
}

enum GroupVerificationType {
  ApplyNeedInviteNot,
  AllNeed,
  AllNot,
}
