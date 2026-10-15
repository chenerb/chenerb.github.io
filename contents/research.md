### Multi-sensor fusion for integrated air-ground anti-UAV systems
<small class="entry-meta">Member · May – July 2026</small>

- Standardized radar, visible-light, spectrum, and protocol sensor observations; built a rule-based fusion baseline using temporal-spatial windows, Hungarian matching, and multi-level confidence estimation.
- Designed a DETR-style encoder–decoder Transformer with modality embeddings, learnable object queries, and cross-attention for variable-length sensor observations.
- Improved F1 from **0.033 to 0.91**, reduced angular MAE from **12.75° to 2.679°**, and reduced range MAE from **473 m to 162 m**. Achieved a 74.6% hit rate within a 3° angular threshold and investigated object-query homogenization as a confidence-discrimination bottleneck.

### Multi-sensor perception data processing and algorithm evaluation
<small class="entry-meta">Member · April – June 2026</small>

- Parsed and aligned radar, vision, electronic intelligence, and RTK data across ROS Bag/MCAP datasets, resolving differences in coordinates, timestamps, fields, and Track IDs.
- Built an RTK-based evaluation pipeline using temporal interpolation, spatial gating, and one-to-one matching. Processed **7 field Bags, over 370,000 sensor observations, and 70,000 ground-truth records**.
- Evaluated localization, velocity, angular error, detection latency, and tracking continuity. Identified the limits of single-target ground truth for multi-target evaluation and adapted the evaluation to cooperative single-target localization and tracking.

### Aortic AI and AorticNano™: abdominal aortic aneurysm screening
<small class="entry-meta">Team leader · China International College Students’ Innovation Competition · February – August 2025</small>

- Developed a screening and management system combining saliva-based detection, AI risk assessment, and portable hardware; authored a research paper and business plan.
- Integrated proteomics, radiomics, and pathology data to construct the Aortic AI 1.0 risk model using the OptiMHC 1.0 peptide database, with a reported **AUC above 0.949**.
- Designed an ESP32-based screening stick with a microfluidic chip and five-channel glassy carbon electrodes. The project reported a **10-minute assessment and 95.2% sensitivity**, with an estimated per-test cost one-fourteenth that of conventional imaging-based screening.
- Built risk-tracking software with visualizations, personalized interventions, referral support, and DeepSeek Reasoner API integration. Received the **Shanghai Gold Award (top 10%)**.

### Adaptive suction device for sea cucumber harvesting
<small class="entry-meta">Member · College Students’ Innovative Entrepreneurial Training Plan Program · October 2023 – October 2024</small>

- Designed a pulsating-flow suction device with variable-diameter nozzles to improve harvesting efficiency and reduce damage.
- Modeled the nozzle in SolidWorks, assembled a 3D-printed prototype, simulated suction with STAR-CCM+, and validated the design through pull-out experiments.
- Used Arduino-controlled servo actuation and computer vision for adaptive nozzle control; developed a CNN for sea-state recognition at the nozzle and deployed it on STM32. Received an **A+ rating (top 10%)**.

### AI Intelligent Eye: embedded image quality evaluation
<small class="entry-meta">Member · Intel Cup Embedded System Design Contest · June – August 2024</small>

- Built two datasets of over 12 GB each from KonIQ-10k, SPAQ, and DSLR images; adapted ResNet-50 for image quality assessment.
- Proposed StairIQA with multi-scale staircase feature integration and a dimensionality-reduction bottleneck.
- Deployed the model on the Naza N97 board with Ubuntu and its SDK, packaged standalone software, and built a GUI for real-time scoring and photography guidance. Received **East China First Prize and National Second Prize (top 8%)**.
