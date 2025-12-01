/**
 * JWT Payload Interface
 * JWT token içinde taşınan veri yapısını tanımlar
 */
export interface JwtPayload {
  /** Kullanıcının benzersiz kimlik numarası */
  sub: number;
  
  /** Kullanıcının rol isimleri (string array) */
  roles: string[];
}

/**
 * Request User Interface
 * JWT doğrulandıktan sonra request.user'a atanan veri yapısı
 */
export interface RequestUser {
  /** Kullanıcının benzersiz kimlik numarası */
  sub: number;
  
  /** Kullanıcının rol isimleri (string array) */
  roles: string[];
}
