"""
Compute statistical profiles (mean and std) for each disorder from EEG datasets.
Generates disorder_statistics.json for use in synthetic EEG data generation.
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent  # Go up to NeuroBuddy-main
BRMH_PATH = BASE_DIR / "EEG Dataset" / "EEG.machinelearing_data_BRMH.csv"
ADHD_PATH = BASE_DIR / "EEG Dataset" / "adhdata.csv"
OUTPUT_PATH = Path(__file__).parent / "disorder_statistics.json"  # Save in ML folder

def load_and_process_brmh():
    """Load BRMH dataset and compute statistics per disorder."""
    print("Loading BRMH dataset...")
    df = pd.read_csv(BRMH_PATH)
    
    # Get all EEG feature columns (AB.* columns - band power features)
    eeg_columns = [col for col in df.columns if col.startswith('AB.')]
    print(f"Found {len(eeg_columns)} EEG features")
    
    # Group by specific disorder and compute statistics
    statistics = {}
    
    for disorder, group in df.groupby('specific.disorder'):
        if disorder == 'specific.disorder':  # Skip header row if present
            continue
            
        # Select only numeric EEG columns
        numeric_data = group[eeg_columns].select_dtypes(include=[np.number])
        
        if len(numeric_data) > 0:
            statistics[disorder] = {
                'features': numeric_data.columns.tolist(),
                'mean': numeric_data.mean().tolist(),
                'std': numeric_data.std().fillna(1.0).tolist(),  # Fill NaN std with 1.0
                'count': len(numeric_data)
            }
            print(f"  [OK] {disorder}: {len(numeric_data)} samples")
    
    return statistics, eeg_columns

def create_synthetic_profiles(base_statistics, eeg_columns):
    """Create synthetic profiles for disorders not in dataset."""
    synthetic = {}
    
    # Get healthy control as base
    healthy = base_statistics.get('Healthy control')
    if not healthy:
        print("Warning: No healthy control baseline found")
        return synthetic
    
    # ASD - Modified sensory processing patterns
    # Literature suggests altered alpha and gamma bands
    print("\nCreating synthetic profiles...")
    asd_mean = np.array(healthy['mean']).copy()
    asd_std = np.array(healthy['std']).copy()
    # Modify alpha and gamma bands (increase variability)
    alpha_indices = [i for i, col in enumerate(eeg_columns) if 'alpha' in col.lower()]
    gamma_indices = [i for i, col in enumerate(eeg_columns) if 'gamma' in col.lower()]
    for idx in alpha_indices:
        asd_mean[idx] *= 1.15  # Increased alpha
    for idx in gamma_indices:
        asd_mean[idx] *= 1.25  # Increased gamma
        asd_std[idx] *= 1.3    # More variability
    
    synthetic['ASD'] = {
        'features': eeg_columns,
        'mean': asd_mean.tolist(),
        'std': asd_std.tolist(),
        'count': 0,
        'synthetic': True,
        'base': 'Healthy control with sensory processing modifications'
    }
    print("  [OK] ASD (synthetic)")
    
    # Dyslexia - Modified theta patterns (reading/language processing)
    dyslexia_mean = np.array(healthy['mean']).copy()
    dyslexia_std = np.array(healthy['std']).copy()
    theta_indices = [i for i, col in enumerate(eeg_columns) if 'theta' in col.lower()]
    for idx in theta_indices:
        dyslexia_mean[idx] *= 1.2  # Increased theta
        dyslexia_std[idx] *= 1.25
    
    synthetic['Dyslexia'] = {
        'features': eeg_columns,
        'mean': dyslexia_mean.tolist(),
        'std': dyslexia_std.tolist(),
        'count': 0,
        'synthetic': True,
        'base': 'Healthy control with language processing modifications'
    }
    print("  [OK] Dyslexia (synthetic)")
    
    # Tourette's - Use OCD profile with motor modifications if available
    ocd = base_statistics.get('Obsessive compulsitve disorder')
    if ocd:
        tourettes_mean = np.array(ocd['mean']).copy()
        tourettes_std = np.array(ocd['std']).copy()
        # Modify beta bands (motor control)
        beta_indices = [i for i, col in enumerate(eeg_columns) if 'beta' in col.lower()]
        for idx in beta_indices:
            tourettes_mean[idx] *= 1.1
            tourettes_std[idx] *= 1.2
        
    synthetic['Tourettes'] = {
            'mean': tourettes_mean.tolist(),
            'std': tourettes_std.tolist(),
            'count': 0,
            'features': eeg_columns
        }
        
    # ADHD - Frontal slowing (increased theta, decreased beta)
    adhd_mean = np.array(healthy['mean']).copy()
    adhd_std = np.array(healthy['std']).copy()
    theta_indices = [i for i, col in enumerate(eeg_columns) if 'theta' in col.lower() and ('f' in col.lower() or 'fp' in col.lower())]
    beta_indices = [i for i, col in enumerate(eeg_columns) if 'beta' in col.lower() and ('f' in col.lower() or 'fp' in col.lower())]
    
    for idx in theta_indices:
        adhd_mean[idx] *= 1.25  # Increased frontal theta
    for idx in beta_indices:
        adhd_mean[idx] *= 0.85  # Decreased frontal beta
        
    synthetic['ADHD'] = {
        'mean': adhd_mean.tolist(),
        'std': adhd_std.tolist(),
        'count': 0,
        'features': eeg_columns
    }
        
    return synthetic

def add_adhd_statistics(statistics, eeg_columns):
    """
    Add ADHD statistics from adhdata.csv.
    Note: adhdata has raw electrode values, not band powers like BRMH.
    We'll use ADHD label but note the different feature space.
    """
    print("\nProcessing ADHD dataset...")
    try:
        df_adhd = pd.read_csv(ADHD_PATH)
        
        # Get ADHD samples only
        adhd_samples = df_adhd[df_adhd['Class'] == 'ADHD']
        
        # Get electrode columns (all except Class and ID)
        electrode_cols = [col for col in df_adhd.columns if col not in ['Class', 'ID']]
        
        # Since ADHD data has different features (raw electrodes vs band powers),
        # we need to map to BRMH format or note this limitation
        # For now, we'll create a separate ADHD_raw profile
        adhd_data = adhd_samples[electrode_cols].select_dtypes(include=[np.number])
        
        # Note: This won't match BRMH feature format perfectly
        # But we'll include it for ADHD-specific generation if needed
        statistics['ADHD_raw_electrodes'] = {
            'features': electrode_cols,
            'mean': adhd_data.mean().tolist(),
            'std': adhd_data.std().fillna(1.0).tolist(),
            'count': len(adhd_data),
            'note': 'Raw electrode values, different feature space from BRMH'
        }
        print(f"  [OK] ADHD (raw electrodes): {len(adhd_data)} samples")
        print(f"  Note: ADHD data uses different features than BRMH dataset")
        
    except Exception as e:
        print(f"  [X] Error processing ADHD data: {e}")
    
    return statistics

def main():
    """Main execution function."""
    print("="*60)
    print("EEG Disorder Statistics Generator")
    print("="*60)
    
    # Load BRMH data and compute statistics
    statistics, eeg_columns = load_and_process_brmh()
    
    # Create synthetic profiles
    synthetic = create_synthetic_profiles(statistics, eeg_columns)
    statistics.update(synthetic)
    
    # Add ADHD data
    statistics = add_adhd_statistics(statistics, eeg_columns)
    
    # Save to JSON
    print(f"\nSaving statistics to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(statistics, f, indent=2)
    
    print("="*60)
    print(f"[OK] Statistics computed for {len(statistics)} disorder profiles")
    print(f"[OK] Saved to: {OUTPUT_PATH}")
    print("="*60)
    
    # Summary
    print("\nDisorder profiles created:")
    for disorder, stats in statistics.items():
        synthetic_tag = " (synthetic)" if stats.get('synthetic') else ""
        print(f"  • {disorder}: {stats.get('count', 0)} samples{synthetic_tag}")

if __name__ == "__main__":
    main()
