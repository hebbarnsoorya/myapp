package com.test.ppl.mapper;

import com.test.ppl.model.dto.UserDTO;
import com.test.ppl.model.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);
    User toEntity(UserDTO dto);
}
