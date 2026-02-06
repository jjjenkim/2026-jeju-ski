# Instagram Carousel Configuration
class Config:
    GEMINI_API_KEY = "AIzaSyAaNAfLsf5AzNV2aRQBIfOWkHpv-mpfDCI"  # https://aistudio.google.com/app/apikey
    
    # 콘텐츠 설정
    TOPIC = "2026 올림픽 스노보드 프리뷰"        # 바꿀 주제
    AUDIENCE = "스노보드 입문자"                      # 타깃
    SLIDES_COUNT = 7                              # 슬라이드 수 (2~10)
    
    # 디자인 설정
    COLOR_PALETTE = "네이비 #0B1220, 화이트 #FFFFFF, 골드 #FBBF24"
    TONE = "전문적이지만 친근한 톤, 스포티한 느낌"
    
    # 기술 설정 (고정, 변경 불필요)
    IMAGE_MODEL = "gemini-2.5-flash-exp-image-generation"
    ASPECT_RATIO = "4:5"                          # 인스타 Portrait
    WIDTH = 1080
    HEIGHT = 1350
    OUTPUT_DIR = "instagram_carousel_output"
