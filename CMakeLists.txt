cmake_minimum_required(VERSION 3.16)
project(onekvm_extension_netbird LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(PkgConfig REQUIRED)
pkg_check_modules(JSON_C REQUIRED json-c)
find_file(JSON_C_STATIC_LIBRARY NAMES libjson-c.a
  HINTS ${JSON_C_LIBRARY_DIRS} NO_DEFAULT_PATH)
if(NOT JSON_C_STATIC_LIBRARY)
  message(FATAL_ERROR "Static json-c library not found")
endif()

add_executable(onekvm-netbird-controller src/main.cpp)
target_compile_options(onekvm-netbird-controller PRIVATE
  -Wall -Wextra -Wpedantic)
target_include_directories(onekvm-netbird-controller PRIVATE
  ${JSON_C_INCLUDE_DIRS})
target_link_libraries(onekvm-netbird-controller PRIVATE
  ${JSON_C_STATIC_LIBRARY} m)

install(TARGETS onekvm-netbird-controller RUNTIME DESTINATION bin)

include(CTest)
if(BUILD_TESTING)
  add_test(NAME controller-lifecycle
    COMMAND ${CMAKE_CURRENT_SOURCE_DIR}/tests/controller-test.sh
            $<TARGET_FILE:onekvm-netbird-controller>)
endif()

