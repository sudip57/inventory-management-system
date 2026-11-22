package com.inventory.entity;

public enum UnitStatus {
    IN_STOCK,   // counts towards the item's stock quantity
    ASSIGNED,
    IN_REPAIR,
    SOLD,
    RETIRED
}
