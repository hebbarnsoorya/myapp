package com.test.ppl.service;

import com.test.ppl.model.dto.UserDTO;
import com.test.ppl.model.entity.User;
import com.test.ppl.exception.CustomBusinessException;
import com.test.ppl.mapper.UserMapper;
import com.test.ppl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new CustomBusinessException("User not found", "USER_NOT_FOUND"));
    }

    public UserDTO createUser(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new CustomBusinessException("Email already exists", "EMAIL_EXISTS");
        }
        User user = userMapper.toEntity(dto);
        User saved = userRepository.save(user);
        log.info("User created: {}", saved.getId());
        return userMapper.toDto(saved);
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("User not found", "USER_NOT_FOUND"));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setAge(dto.getAge());

        User updated = userRepository.save(existing);
        log.info("User updated: {}", updated.getId());
        return userMapper.toDto(updated);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new CustomBusinessException("User not found", "USER_NOT_FOUND");
        }
        userRepository.deleteById(id);
        log.info("User deleted: {}", id);
    }
}
