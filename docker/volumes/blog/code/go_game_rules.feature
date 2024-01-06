
#Feature: Fair play
#  In order to be honorable
#  As a go player
#  I will respect the rules

Feature: Enforcing the game rules
  In order to be fair
  As a referee
  I will enforce the game rules

  Background:
    Given I am white in a game of size 3
    And the symbol for a black stone is █
    And the symbol for a white stone is ▒
    And it is my turn


  Scenario: Suicide
    Given the game looks like this :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█--- ---█--
  |   |   |
--█---▒---█--
  |   |   |   |   |   |   |   |   |   |   |   |
--█---▒---▒---█--- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- ---█---█--- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""
    When I try to play on the X :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█---X---█--
  |   |   |
--█---▒---█--
  |   |   |   |   |   |   |   |   |   |   |   |
--█---▒---▒---█--- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- ---█---█--- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""
    Then the game should reject my move
    And it should still be my turn



  Scenario: Ko
    Given the game looks like this :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█---▒---█--
  |   |   |
--▒--- ---▒--
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""
    When white plays on the X :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█---▒---█--
  |   |   |
--▒--- ---▒--
  |   |   |   |   |   |   |   |   |   |   |   |
-- ---X--- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""
    When black plays on the X :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█---▒---█--
  |   |   |
--▒---X---▒--
  |   |   |   |   |   |   |   |   |   |   |   |
-- ---▒--- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""
    And then white tries to play on the X :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█---X---█--
  |   |   |
--▒---█---▒--
  |   |   |   |   |   |   |   |   |   |   |   |
-- ---▒--- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""
    Then the game should reject the move
    And the game should look like this :
"""
  |   |   |
-- ---█--- --
  |   |   |
--█--- ---█--
  |   |   |
--▒---█---▒--
  |   |   |   |   |   |   |   |   |   |   |   |
-- ---▒--- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --- --- --- --- --- --- --- --- --- --
  |   |   |   |   |   |   |   |   |   |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
-- --- --- --
  |   |   |
"""