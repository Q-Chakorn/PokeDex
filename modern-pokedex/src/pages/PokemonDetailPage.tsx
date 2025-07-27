import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemon } from '../contexts/SimplePokemonContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PokemonImage } from '../components/ui/PokemonImage';

const PokemonDetailPage: React.FC = () => {
  const { dexNumber } = useParams<{ dexNumber: string }>();
  const navigate = useNavigate();
  const { pokemon, loading, error } = usePokemon();

  // Find the Pokemon by dex number
  const currentPokemon = pokemon.find(p => p.dexNumber === `#${dexNumber?.padStart(4, '0')}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <p className="text-lg font-semibold">Error loading Pokemon data</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!currentPokemon) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            backgroundColor: '#f2f2f7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{ width: '32px', height: '32px', color: '#86868b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1d1d1f',
            marginBottom: '12px'
          }}>
            Pokémon Not Found
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#86868b',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            The Pokémon with Dex #{dexNumber} could not be found.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              fontSize: '17px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: '#007aff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getTypeIcon = (typeName: string) => {
    const icons: { [key: string]: string } = {
      Fire: '🔥',
      Water: '💧',
      Grass: '🌿',
      Electric: '⚡',
      Psychic: '🔮',
      Bug: '🐛',
      Normal: '⭐',
      Poison: '☠️',
      Flying: '🦅',
      Rock: '🪨',
      Ground: '🌍',
      Fighting: '👊',
      Ghost: '👻',
      Steel: '⚔️',
      Ice: '❄️',
      Dragon: '🐉',
      Dark: '🌙',
      Fairy: '🧚'
    };
    return icons[typeName] || '❓';
  };

  const getStatColor = (statName: string) => {
    const colors: { [key: string]: string } = {
      hp: '#ef4444',
      attack: '#f97316',
      defense: '#3b82f6',
      spAttack: '#8b5cf6',
      spDefense: '#06b6d4',
      speed: '#10b981'
    };
    return colors[statName] || '#6b7280';
  };

  const getStatBarWidth = (value: number) => {
    return Math.min((value / 200) * 100, 100);
  };

  const totalStats = currentPokemon.stats.hp + currentPokemon.stats.attack + currentPokemon.stats.defense + 
                    currentPokemon.stats.spAttack + currentPokemon.stats.spDefense + currentPokemon.stats.speed;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7'
    }}>
      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(135deg, ${currentPokemon.types[0]?.color || '#68A090'} 0%, ${currentPokemon.types[1]?.color || currentPokemon.types[0]?.color || '#68A090'} 100%)`,
        color: 'white',
        padding: '3rem 1.5rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pokédex
          </button>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem'
          }}>
            {/* Pokemon Number */}
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              opacity: '0.8',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {currentPokemon.dexNumber}
            </div>

            {/* Pokemon Avatar */}
            <PokemonImage
              dexNumber={currentPokemon.dexNumber}
              name={currentPokemon.name}
              primaryType={currentPokemon.types[0]?.name}
              size="large"
            />

            {/* Pokemon Name */}
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              margin: '0',
              letterSpacing: '-0.022em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {currentPokemon.name}
            </h1>

            {/* Types */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {currentPokemon.types.map((type) => (
                <span
                  key={type.name}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {getTypeIcon(type.name)} {type.name}
                </span>
              ))}
            </div>

            {/* Legendary Badge */}
            {currentPokemon.isLegendary && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                ✨ Legendary Pokémon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Basic Information */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8ed'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1d1d1f',
              margin: '0 0 1.5rem',
              letterSpacing: '-0.022em'
            }}>
              Basic Information
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Pokédex No.
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1d1d1f'
                }}>
                  {currentPokemon.dexNumber}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Type
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1d1d1f'
                }}>
                  {currentPokemon.types.map(type => type.name).join(' / ')}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Status
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1d1d1f'
                }}>
                  {currentPokemon.isLegendary ? 'Legendary' : 'Normal'}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Generation
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1d1d1f'
                }}>
                  Kanto (Gen I)
                </div>
              </div>
            </div>
          </div>

          {/* Base Stats */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8ed'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1d1d1f',
              margin: '0 0 1.5rem',
              letterSpacing: '-0.022em'
            }}>
              Base Stats
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'HP', value: currentPokemon.stats.hp, key: 'hp' },
                { name: 'Attack', value: currentPokemon.stats.attack, key: 'attack' },
                { name: 'Defense', value: currentPokemon.stats.defense, key: 'defense' },
                { name: 'Sp. Attack', value: currentPokemon.stats.spAttack, key: 'spAttack' },
                { name: 'Sp. Defense', value: currentPokemon.stats.spDefense, key: 'spDefense' },
                { name: 'Speed', value: currentPokemon.stats.speed, key: 'speed' }
              ].map((stat) => (
                <div key={stat.key} style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#64748b',
                      letterSpacing: '0.5px'
                    }}>
                      {stat.name.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1d1d1f'
                    }}>
                      {stat.value}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${getStatBarWidth(stat.value)}%`,
                      backgroundColor: getStatColor(stat.key),
                      borderRadius: '3px',
                      transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }} />
                  </div>
                </div>
              ))}

              {/* Total Stats */}
              <div style={{
                background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '12px',
                marginTop: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    TOTAL
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    {totalStats}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Abilities */}
          {currentPokemon.abilities && currentPokemon.abilities.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8ed'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1d1d1f',
                margin: '0 0 1.5rem',
                letterSpacing: '-0.022em'
              }}>
                Abilities
              </h2>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                {currentPokemon.abilities.map((ability, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                      textTransform: 'capitalize'
                    }}>
                      {ability}
                    </span>
                  </div>
                ))}
                
                {currentPokemon.hiddenAbility && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                      textTransform: 'capitalize'
                    }}>
                      {currentPokemon.hiddenAbility}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Hidden
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {currentPokemon.bio && (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8ed',
              gridColumn: '1 / -1'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1d1d1f',
                margin: '0 0 1.5rem',
                letterSpacing: '-0.022em'
              }}>
                Description
              </h2>

              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#64748b',
                background: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '12px',
                margin: '0',
                borderLeft: '4px solid #007aff'
              }}>
                {currentPokemon.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;