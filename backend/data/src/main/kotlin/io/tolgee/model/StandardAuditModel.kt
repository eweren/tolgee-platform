package io.tolgee.model

import org.hibernate.envers.Audited
import org.springframework.data.util.ProxyUtils
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.MappedSuperclass
import javax.persistence.SequenceGenerator

@MappedSuperclass
@Audited
abstract class StandardAuditModel : AuditModel() {
  @Id
  @SequenceGenerator(
    name = "sequenceGenerator",
    sequenceName = "hibernate_sequence",
    initialValue = 1000000000,
    allocationSize = 100
  )
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "sequenceGenerator"
  )
  val id: Long = 0

  override fun equals(other: Any?): Boolean {
    other ?: return false

    if (this === other) return true

    if (javaClass != ProxyUtils.getUserClass(other)) return false

    other as StandardAuditModel

    return this.id == other.id
  }

  override fun hashCode(): Int {
    return 31
  }

  override fun toString() = "${this.javaClass.name}(id: $id)"
}
