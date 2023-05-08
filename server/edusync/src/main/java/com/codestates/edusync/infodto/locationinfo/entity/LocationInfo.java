package com.codestates.edusync.infodto.locationinfo.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class LocationInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200, nullable = false)
    private String address;

    @Column(nullable = true)
    private Float latitude;

    @Column(nullable = true)
    private Float longitude;
}